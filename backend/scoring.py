"""Transaction risk scoring.

Rule-based for the prototype. This module is the piece intended to be swapped for a
trained model (e.g. gradient boosting / small NN served from IBM LinuxONE) - keep the
`score_transaction` signature and the API contract stays identical.
"""
from dataclasses import dataclass

KNOWN_PAYEES = {"priya.nair@upi", "9876500001@upi", "ELECTRICITY-TNEB", "123456789012"}

HIGH_THRESHOLD = 70


@dataclass
class TxnResult:
    risk_score: int
    status: str
    indicators: list
    explanation: str
    spoken_warning: str


def score_transaction(amount, is_new_payee, call_risk, call_active):
    pts, ind = 0, []

    if call_active and call_risk >= 70:
        pts += 50
        ind.append("You are on a call that shows strong scam signs (call risk %d/100)." % call_risk)
    elif call_active and call_risk >= 40:
        pts += 25
        ind.append("You are on a call that shows some scam signs (call risk %d/100)." % call_risk)

    if amount >= 50000:
        pts += 30
        ind.append("This is a large amount: Rs. {:,.0f}.".format(amount))
    elif amount >= 10000:
        pts += 15
        ind.append("This is a fairly large amount: Rs. {:,.0f}.".format(amount))

    if is_new_payee:
        pts += 20
        ind.append("You have never paid this person or account before.")

    if call_active and call_risk >= 40 and is_new_payee:
        pts += 10
        ind.append("A new payment is being made while a suspicious call is still going on.")

    score = min(100, pts)
    status = "high" if score >= HIGH_THRESHOLD else "low"

    if status == "high":
        explanation = ("This payment looks like a scam. " + " ".join(ind) +
                       " Real police, courts and banks never ask you to transfer money to prove your "
                       "innocence or to keep a call secret.")
        spoken = ("Stop. Please do not send this money. You are on a call that looks like a scam, and you "
                  "are paying someone new. Real police and banks never ask for money over the phone. "
                  "Hang up, and speak to someone you trust.")
    else:
        explanation, spoken = "No major warning signs found.", ""

    return TxnResult(score, status, ind, explanation, spoken)
