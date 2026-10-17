# ScamShield Voice (prototype)

```
scamshield-voice/
├── backend/            FastAPI
│   ├── main.py         3 routes: simulate-call (NDJSON stream), score-transaction, tts-warning
│   ├── scoring.py      transaction risk logic  <- swap for ML model served on IBM LinuxONE
│   ├── scripts.py      scam + normal call scripts, flag catalogue & weights
│   └── requirements.txt
└── frontend/           Next.js 14 (app router) + Tailwind + lucide-react
    ├── app/            layout.js, page.js (state + orchestration), globals.css
    ├── components/     CallPanel, RiskGauge, Waveform, BankingForm, InterventionModal
    └── lib/            api.js (streaming client), speech.js (Web Speech TTS)
```

## Run locally

Terminal 1:
```
cd backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Terminal 2 (needs internet once, for the Google font):
```
cd frontend
npm install
npm run dev
```
Open http://localhost:3000 (use Chrome or Edge for the spoken warning).

## Demo script
1. Click **Start Scam Call**. Transcript fills in every ~2.6s, flags appear as red chips, gauge climbs to red.
2. When the gauge is red, enter Payee `Ramesh Kumar`, ID `ramesh@upi`, Amount `50000`, click **Transfer Funds**.
3. Full-screen red warning appears, the explanation is shown, the warning is spoken.
4. Try **Cancel Transfer** and **Request Trusted Contact Approval**.
5. Contrast: **Start Normal Call**, repeat the same transfer. It goes through (low risk).

## Moving the scorer to IBM LinuxONE
Keep the API contract in `main.py`. Replace `score_transaction()` and the per-chunk flag logic with a trained
model (scikit-learn / ONNX / Snap ML) and deploy the FastAPI service on LinuxONE (L1CC gives Ubuntu on s390x).
Check that your dependencies have s390x wheels.
