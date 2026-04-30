export default function ToggleRow({ checked, onToggle, label, sublabel, note, right, controls }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        background: checked ? "var(--row-active)" : "transparent",
        transition: "background 0.15s ease",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          border: `1.5px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
          borderRadius: 5,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: checked ? "var(--accent-soft)" : "transparent",
        }}
      >
        {checked ? <span style={{ color: "var(--accent)", fontSize: 10 }}>+</span> : null}
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 12, color: "var(--text-1)" }}>{label}</div>
        {sublabel ? <div style={{ fontSize: 10, color: "var(--text-3)" }}>{sublabel}</div> : null}
        {note ? <div style={{ fontSize: 10, color: "var(--warning)" }}>{note}</div> : null}
      </div>
      <div style={{ minWidth: 120, textAlign: "right" }}>
        <div style={{ fontSize: 12, color: checked ? "var(--accent)" : "var(--text-3)" }}>{right}</div>
      </div>
      {controls ? (
        <div onClick={(event) => event.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {controls}
        </div>
      ) : null}
    </div>
  );
}
