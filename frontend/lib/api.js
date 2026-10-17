export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed (${res.status})`);
  return res.json();
}

/** Reads the NDJSON stream from /api/simulate-call and calls onChunk for every line. */
export async function streamCall(scenario, onChunk, signal) {
  const res = await fetch(`${API}/api/simulate-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error("Could not start call");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const l of lines) if (l.trim()) onChunk(JSON.parse(l));
  }
}

export const scoreTransaction = (payload) => post("/api/score-transaction", payload);
export const getTtsCommand = (text) => post("/api/tts-warning", { text, engine: "web_speech" });
