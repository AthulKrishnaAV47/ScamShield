import { useState } from "react";
import { Landmark, Loader2 } from "lucide-react";

const field = "mt-2 w-full rounded-xl border-2 border-ink/60 bg-white px-4 py-4 text-xl placeholder:text-ink/50";

export default function BankingForm({ busy, notice, onSubmit }) {
  const [f, setF] = useState({ payee_name: "", account_id: "", amount: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.payee_name.trim() && f.account_id.trim() && Number(f.amount) > 0;

  return (
    <section aria-labelledby="bank-h" className="rounded-2xl border-2 border-line bg-white p-6 shadow-sm">
      <h2 id="bank-h" className="flex items-center gap-3 text-3xl font-bold"><Landmark aria-hidden /> Send money</h2>
      <p className="mt-1 text-lg text-ink/80">Savings account balance: Rs. 4,82,350</p>

      <form className="mt-5 space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, amount: Number(f.amount) }, () => setF({ payee_name: "", account_id: "", amount: "" })); }}>
        <label className="block text-xl font-bold">Payee name
          <input className={field} value={f.payee_name} onChange={set("payee_name")} placeholder="e.g. Ramesh Kumar" autoComplete="off" />
        </label>
        <label className="block text-xl font-bold">Account number or UPI ID
          <input className={field} value={f.account_id} onChange={set("account_id")} placeholder="e.g. ramesh@upi" autoComplete="off" />
        </label>
        <label className="block text-xl font-bold">Amount (Rs.)
          <input className={field} type="number" inputMode="numeric" min="1" value={f.amount} onChange={set("amount")} placeholder="50000" />
        </label>
        <button disabled={!valid || busy} type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-trust px-5 py-5 text-2xl font-bold text-white hover:bg-trust-dark disabled:cursor-not-allowed disabled:bg-ink/40">
          {busy && <Loader2 className="animate-spin" aria-hidden />} Transfer Funds
        </button>
      </form>

      {notice && (
        <p role="status" className={`mt-5 rounded-xl p-4 text-xl font-bold ${notice.kind === "ok" ? "bg-safe text-white" : "bg-ink text-white"}`}>{notice.text}</p>
      )}
      <p className="mt-4 text-base text-ink/70">Demo tip: known payee IDs are priya.nair@upi and ELECTRICITY-TNEB.</p>
    </section>
  );
}
