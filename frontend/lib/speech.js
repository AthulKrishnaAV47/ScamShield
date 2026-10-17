/** Speaks text using the browser's Web Speech API (the "simulated TTS" for the demo). */
export function speak(cmd, { onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) { onEnd?.(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(cmd.text);
  u.lang = cmd.lang || "en-IN";
  u.rate = cmd.rate ?? 0.9;
  u.pitch = cmd.pitch ?? 1;
  const voices = synth.getVoices();
  u.voice = voices.find((v) => v.lang === u.lang) || voices.find((v) => v.lang.startsWith("en")) || null;
  u.onstart = () => onStart?.();
  u.onend = u.onerror = () => onEnd?.();
  synth.speak(u);
}

export const stopSpeaking = () => typeof window !== "undefined" && window.speechSynthesis?.cancel();
