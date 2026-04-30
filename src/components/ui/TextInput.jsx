export default function TextInput({ value, onChange, placeholder, style = {} }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => { event.target.style.borderColor = "var(--accent)"; }}
      onBlur={(event) => { event.target.style.borderColor = "var(--border-strong)"; }}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--text-1)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        padding: "8px 10px",
        borderRadius: 8,
        outline: "none",
        ...style,
      }}
    />
  );
}
