"""ScamShield Voice - FastAPI backend.   Run:  uvicorn main:app --reload --port 8000"""
import asyncio
import json
import os
import tempfile
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, Field

from scoring import KNOWN_PAYEES, score_transaction
from scripts import FLAG_LABELS, FLAG_WEIGHTS, SCRIPTS

app = FastAPI(title="ScamShield Voice API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


# ---------------------------------------------------------------- 1. simulate call
class CallRequest(BaseModel):
    scenario: Literal["scam", "normal"]
    chunk_delay: float = Field(2.6, ge=0, le=10, description="Seconds between STT chunks")


@app.post("/api/simulate-call")
async def simulate_call(req: CallRequest):
    """Streams newline-delimited JSON, one object per simulated STT chunk."""
    script = SCRIPTS[req.scenario]

    async def gen():
        seen, score = set(), 4.0  # small baseline so the gauge is never exactly 0
        for i, chunk in enumerate(script):
            await asyncio.sleep(req.chunk_delay)
            for f in chunk["flags"]:
                w = FLAG_WEIGHTS[f]
                score += w if f not in seen else w * 0.25  # repeats count less
                seen.add(f)
            payload = {
                "index": i,
                "total": len(script),
                "speaker": chunk["speaker"],
                "text": chunk["text"],
                "flags": [{"id": f, "label": FLAG_LABELS[f]} for f in chunk["flags"]],
                "call_risk_score": min(100, round(score)),
                "done": i == len(script) - 1,
            }
            yield json.dumps(payload) + "\n"

    return StreamingResponse(gen(), media_type="application/x-ndjson")


# ---------------------------------------------------------------- 2. score transaction
class TxnRequest(BaseModel):
    amount: float = Field(..., gt=0)
    payee_name: str = ""
    account_id: str = ""
    is_new_payee: Optional[bool] = None  # if omitted, derived from KNOWN_PAYEES
    call_risk_score: int = Field(0, ge=0, le=100)
    call_active: bool = False


@app.post("/api/score-transaction")
def score_txn(req: TxnRequest):
    new_payee = req.is_new_payee
    if new_payee is None:
        new_payee = req.account_id.strip() not in KNOWN_PAYEES
    r = score_transaction(req.amount, new_payee, req.call_risk_score, req.call_active)
    return {
        "transaction_risk_status": r.status,
        "transaction_risk_score": r.risk_score,
        "warning_indicators": r.indicators,
        "explanation": r.explanation,
        "spoken_warning": r.spoken_warning,
        "is_new_payee": new_payee,
    }


# ---------------------------------------------------------------- 3. TTS warning
class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=600)
    engine: Literal["web_speech", "pyttsx3"] = "web_speech"


@app.post("/api/tts-warning")
def tts_warning(req: TTSRequest):
    """Default: return a Web Speech API command for the browser to speak.
    engine=pyttsx3: synthesise a WAV on the server (needs `pip install pyttsx3`)."""
    if req.engine == "web_speech":
        return {"engine": "web_speech", "text": req.text, "lang": "en-IN", "rate": 0.9, "pitch": 1.0}
    try:
        import pyttsx3  # optional dependency

        path = os.path.join(tempfile.gettempdir(), "scamshield_warning.wav")
        eng = pyttsx3.init()
        eng.setProperty("rate", 150)
        eng.save_to_file(req.text, path)
        eng.runAndWait()
        with open(path, "rb") as f:
            return Response(f.read(), media_type="audio/wav")
    except Exception as e:  # noqa: BLE001
        raise HTTPException(501, f"pyttsx3 unavailable: {e}")
