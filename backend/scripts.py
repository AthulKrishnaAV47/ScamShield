"""Placeholder call scripts + scam-language flag catalogue.

Each chunk simulates one Speech-to-Text segment. Replace `flags` with the output of
a real classifier later; the rest of the pipeline does not change.
"""

FLAG_LABELS = {
    "authority_impersonation": "Caller claims to be police or a government officer",
    "threat_of_arrest": "Threat of arrest or legal action",
    "urgency": "Pressure to act immediately",
    "secrecy": "Told not to tell family or the bank",
    "payment_request": "Asked to move money to a 'safe' account",
    "otp_request": "Asked to share an OTP or PIN",
    "remote_access": "Asked to install a screen-sharing app",
}

# Weight of each flag in the running call-risk score (first occurrence).
FLAG_WEIGHTS = {
    "authority_impersonation": 14,
    "threat_of_arrest": 22,
    "urgency": 12,
    "secrecy": 16,
    "payment_request": 18,
    "otp_request": 18,
    "remote_access": 14,
}

SCAM_SCRIPT = [
    {"speaker": "Caller", "flags": ["authority_impersonation"],
     "text": "Hello, this is Inspector Rajesh Verma from the Mumbai Cyber Crime Branch. Am I speaking with the account holder?"},
    {"speaker": "You", "flags": [],
     "text": "Yes, I am. Who is this? What is this about?"},
    {"speaker": "Caller", "flags": ["threat_of_arrest"],
     "text": "A parcel in your name was seized at the airport with fake passports and drugs. Your Aadhaar is linked to a money laundering case."},
    {"speaker": "You", "flags": [],
     "text": "Oh no. I did not send any parcel. I am a retired schoolteacher."},
    {"speaker": "Caller", "flags": ["threat_of_arrest", "urgency"],
     "text": "From this moment you are under digital arrest. Do not disconnect this call. If you do, police will reach your house within the hour."},
    {"speaker": "Caller", "flags": ["secrecy"],
     "text": "Do not tell your family or your bank about this call. This is a confidential investigation."},
    {"speaker": "You", "flags": [],
     "text": "Please sir, tell me what I should do."},
    {"speaker": "Caller", "flags": ["remote_access"],
     "text": "Install this screen-sharing app so I can supervise your banking and verify your accounts."},
    {"speaker": "Caller", "flags": ["payment_request", "urgency"],
     "text": "To prove your innocence, transfer fifty thousand rupees right now to the RBI safe verification account. It will be refunded after the inquiry."},
    {"speaker": "Caller", "flags": ["otp_request", "urgency"],
     "text": "Quickly, read out the OTP you receive. You have only five minutes."},
]

NORMAL_SCRIPT = [
    {"speaker": "Caller", "flags": [],
     "text": "Hello Amma, it's Priya. How are you feeling today?"},
    {"speaker": "You", "flags": [],
     "text": "I am fine, dear. The knee pain is a little better after the doctor's visit."},
    {"speaker": "Caller", "flags": [],
     "text": "That's good to hear. Did you take your morning tablets?"},
    {"speaker": "You", "flags": [],
     "text": "Yes, I did. And I made sambar for lunch today."},
    {"speaker": "Caller", "flags": [],
     "text": "Lovely. We will come on Sunday for lunch. Should I bring anything?"},
    {"speaker": "You", "flags": [],
     "text": "Just some fresh jasmine flowers from the market, please."},
    {"speaker": "Caller", "flags": [],
     "text": "Of course. Take care, Amma. Call me if you need anything. Bye!"},
]

SCRIPTS = {"scam": SCAM_SCRIPT, "normal": NORMAL_SCRIPT}
