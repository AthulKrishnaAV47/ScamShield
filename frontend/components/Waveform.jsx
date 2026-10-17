const BARS = 36;

export default function Waveform({ active, risky }) {
  return (
    <div aria-hidden="true" className="flex h-20 items-center justify-center gap-[3px] rounded-xl bg-panel px-3">
      {Array.from({ length: BARS }).map((_, i) => {
        const h = 30 + ((i * 37) % 70); // deterministic heights (no hydration mismatch)
        return (
          <span key={i} className={`wave-bar w-1.5 rounded-full ${risky ? "bg-alert" : "bg-trust"}`}
                style={{ height: `${active ? h : 10}%`, animationPlayState: active ? "running" : "paused",
                         animationDuration: `${0.7 + ((i * 13) % 6) / 10}s`, animationDelay: `${(i % 9) * 0.07}s`,
                         opacity: active ? 1 : 0.35 }} />
        );
      })}
    </div>
  );
}
