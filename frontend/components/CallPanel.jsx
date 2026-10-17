import { useEffect, useRef } from "react";
import { Phone, PhoneOff, ShieldAlert } from "lucide-react";
import RiskGauge from "./RiskGauge";
import Waveform from "./Waveform";

export default function CallPanel({ scenario, callActive, transcript, risk, onStart, onEnd }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [transcript]);

  return (
    <section aria-labelledby="call-h" className="rounded-2xl border-2 border-line bg-white p-6 shadow-sm">
      <h2 id="call-h" className="text-3xl font-bold">Phone call</h2>
      <p className="mt-1 text-lg text-ink/80">
        {callActive ? (scenario === "scam" ? "Call in progress: unknown caller" : "Call in progress: Priya (daughter)") : "No call right now"}
      </p>

      {!callActive ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <button onClick={() => onStart("scam")}
                  className="flex items-center justify-center gap-3 rounded-xl bg-alert px-5 py-5 text-xl font-bold text-white hover:bg-alert-dark">
            <ShieldAlert size={28} aria-hidden /> Start Scam Call
          </button>
          <button onClick={() => onStart("normal")}
                  className="flex items-center justify-center gap-3 rounded-xl bg-trust px-5 py-5 text-xl font-bold text-white hover:bg-trust-dark">
            <Phone size={28} aria-hidden /> Start Normal Call
          </button>
        </div>
      ) : (
        <button onClick={onEnd}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-ink px-5 py-5 text-xl font-bold text-white hover:bg-black">
          <PhoneOff size={28} aria-hidden /> End call
        </button>
      )}

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
        <RiskGauge score={risk} />
        <Waveform active={callActive} risky={risk >= 70} />
      </div>

      <h3 className="mt-6 text-2xl font-bold">Live transcript</h3>
      <div role="log" aria-live="polite" className="mt-2 h-72 space-y-3 overflow-y-auto rounded-xl bg-panel p-4">
        {transcript.length === 0 && <p className="text-lg text-ink/70">Start a call to see what is being said.</p>}
        {transcript.map((t) => (
          <div key={t.index} className={`rounded-lg p-3 text-lg leading-snug ${t.flags.length ? "border-l-8 border-alert bg-white" : "bg-white"}`}>
            <p><span className="font-bold">{t.speaker}: </span>{t.text}</p>
            {t.flags.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {t.flags.map((f) => (
                  <li key={f.id} className="rounded-full bg-alert px-3 py-1 text-base font-bold text-white">{f.label}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  );
}
