export default function CatHeader({ label, hint }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>
        {label}
      </span>
      {hint ? <span style={{ fontSize: 10, color: "var(--text-3)" }}>{hint}</span> : null}
    </div>
  );
}
