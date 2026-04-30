export default function SelectInput({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--text-1)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        padding: "6px 9px",
        borderRadius: 8,
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
