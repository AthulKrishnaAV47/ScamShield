import { useEffect, useRef } from "react";
import { OctagonAlert, Volume2, Users, XCircle, CheckCircle2 } from "lucide-react";

export default function InterventionModal({ data, txn, speaking, requested, onCancel, onRequestApproval, onReplay }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="warn-h" aria-describedby="warn-d"
         className="fixed inset-0 z-50 overflow-y-auto bg-alert text-white">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-6 px-6 py-10">
        <div className="flex items-center gap-4">
          <span className="ring-pulse rounded-full"><OctagonAlert size={72} aria-hidden /></span>
          <h2 id="warn-h" className="text-4xl font-bold leading-tight sm:text-5xl">Stop. This payment may be a scam.</h2>
        </div>

        <p className="rounded-xl bg-white/15 p-4 text-2xl">
          Sending <b>Rs. {Number(txn.amount).toLocaleString("en-IN")}</b> to <b>{txn.payee_name}</b> ({txn.account_id}). We have paused it.
        </p>

        <div className="rounded-xl bg-white p-5 text-ink">
          <p id="warn-d" className="text-xl font-bold">Why we stopped it</p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-xl">
            {data.warning_indicators.map((w) => <li key={w}>{w}</li>)}
          </ul>
          <p className="mt-4 text-xl">Real police, courts and banks never ask you to send money to prove your innocence, and never ask you to keep a call secret.</p>
        </div>

        <button onClick={onReplay} className="flex items-center gap-3 self-start rounded-xl border-2 border-white px-5 py-3 text-xl font-bold hover:bg-white/15">
          <Volume2 aria-hidden /> {speaking ? "Speaking the warning..." : "Hear the warning again"}
        </button>

        {requested ? (
          <p role="status" className="flex items-center gap-3 rounded-xl bg-white p-5 text-2xl font-bold text-ink">
            <CheckCircle2 className="text-safe" size={36} aria-hidden />
            Request sent to Priya (daughter). Your money stays on hold until she approves.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <button ref={ref} onClick={onCancel}
                  className="flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-6 text-2xl font-bold text-alert-dark hover:bg-panel">
            <XCircle size={32} aria-hidden /> Cancel Transfer
          </button>
          <button onClick={onRequestApproval} disabled={requested}
                  className="flex items-center justify-center gap-3 rounded-xl border-4 border-white bg-alert-dark px-5 py-6 text-2xl font-bold text-white hover:bg-black disabled:opacity-60">
            <Users size={32} aria-hidden /> Request Trusted Contact Approval
          </button>
        </div>
      </div>
    </div>
  );
}
