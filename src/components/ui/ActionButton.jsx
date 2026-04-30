export default function ActionButton({ label, onClick, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "var(--surface-1)", border: "var(--border-strong)", color: "var(--text-1)" },
    accent:  { bg: "var(--accent)",     border: "var(--accent)",        color: "#08120d" },
    subtle:  { bg: "transparent",       border: "var(--border)",        color: "var(--text-2)" },
  };
  const current = tones[tone] || tones.neutral;
  return (
    <button
      onClick={onClick}
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        borderRadius: 999,
        padding: "8px 12px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </button>
  );
}
