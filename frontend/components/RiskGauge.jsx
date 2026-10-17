export function riskTone(score) {
  if (score >= 70) return { color: "#B3001B", label: "High risk", cls: "text-alert" };
  if (score >= 40) return { color: "#8A4B00", label: "Getting risky", cls: "text-warn" };
  return { color: "#0A6B34", label: "Looks safe", cls: "text-safe" };
}

export default function RiskGauge({ score }) {
  const tone = riskTone(score);
  return (
    <div role="meter" aria-label="Call risk score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}
         className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-[300px]">
        <path d="M 20 100 A 80 80 0 0 1 180 100" pathLength="100" fill="none" stroke="#C9D5E5" strokeWidth="18" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" pathLength="100" fill="none" stroke={tone.color} strokeWidth="18"
              strokeLinecap="round" strokeDasharray={`${Math.max(score, 0.5)} 100`}
              style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.8s ease" }} />
        <text x="100" y="92" textAnchor="middle" className="fill-ink" style={{ font: "700 46px var(--font-body)" }}>{score}</text>
      </svg>
      <p className={`-mt-1 text-2xl font-bold ${tone.cls}`}>{tone.label}</p>
      <p className="text-base text-ink/80">Call risk score (0 to 100)</p>
    </div>
  );
}
