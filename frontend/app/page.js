"use client";
import { useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import CallPanel from "@/components/CallPanel";
import BankingForm from "@/components/BankingForm";
import InterventionModal from "@/components/InterventionModal";
import { streamCall, scoreTransaction, getTtsCommand } from "@/lib/api";
import { speak, stopSpeaking } from "@/lib/speech";

export default function Home() {
  const [scenario, setScenario] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [risk, setRisk] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [intervention, setIntervention] = useState(null); // { result, txn }
  const [speaking, setSpeaking] = useState(false);
  const [requested, setRequested] = useState(false);
  const abortRef = useRef(null);
  const ttsRef = useRef(null);

  const startCall = async (kind) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setScenario(kind); setCallActive(true); setTranscript([]); setRisk(0); setNotice(null);
    try {
      await streamCall(kind, (c) => { setTranscript((t) => [...t, c]); setRisk(c.call_risk_score); }, ac.signal);
    } catch (e) {
      if (e.name !== "AbortError") setNotice({ kind: "info", text: "Could not reach the ScamShield server. Is the backend running on port 8000?" });
    }
  };

  const endCall = () => { abortRef.current?.abort(); setCallActive(false); setRisk(0); };

  const playWarning = async (text) => {
    try {
      ttsRef.current = await getTtsCommand(text);
      speak(ttsRef.current, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
    } catch { /* speech is best-effort; the on-screen warning still shows */ }
  };

  const handleTransfer = async (txn, reset) => {
    setBusy(true); setNotice(null);
    try {
      const result = await scoreTransaction({
        amount: txn.amount, payee_name: txn.payee_name, account_id: txn.account_id,
        call_risk_score: risk, call_active: callActive,
      });
      if (result.transaction_risk_status === "high") {
        setRequested(false); setIntervention({ result, txn }); // halt payment, show overlay
        playWarning(result.spoken_warning);
      } else {
        reset();
        setNotice({ kind: "ok", text: `Done. Rs. ${txn.amount.toLocaleString("en-IN")} sent to ${txn.payee_name}.` });
      }
    } catch {
      setNotice({ kind: "info", text: "Payment not sent: the safety check could not run. Please try again." });
    } finally { setBusy(false); }
  };

  const closeModal = (text) => { stopSpeaking(); setSpeaking(false); setIntervention(null); setNotice({ kind: "info", text }); };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
      <header className="mb-6 flex items-center gap-4">
        <ShieldCheck size={52} className="text-trust" aria-hidden />
        <div>
          <h1 className="text-4xl font-bold">ScamShield Voice</h1>
          <p className="text-xl text-ink/80">We listen for scams on your calls and stop risky payments.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <CallPanel scenario={scenario} callActive={callActive} transcript={transcript} risk={risk} onStart={startCall} onEnd={endCall} />
        <BankingForm busy={busy} notice={notice} onSubmit={handleTransfer} />
      </div>

      {intervention && (
        <InterventionModal data={intervention.result} txn={intervention.txn} speaking={speaking} requested={requested}
          onReplay={() => ttsRef.current && speak(ttsRef.current, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) })}
          onCancel={() => closeModal("Transfer cancelled. Your money is safe.")}
          onRequestApproval={() => setRequested(true)} />
      )}
    </main>
  );
}
