import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, sanitizeNumericInput } from "../../lib/format.js";

export default function NumericInput({
  value,
  onChange,
  min = 0,
  max = 9999999,
  step = 1,
  style = {},
  mode = "integer",
  placeholder,
}) {
  const [draft, setDraft] = useState(String(value ?? 0));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isFocused) setDraft(String(value ?? 0));
  }, [isFocused, value]);

  const commit = useCallback(
    (raw) => {
      const next = sanitizeNumericInput(raw, mode);
      if (next === "") {
        onChange(min <= 0 ? 0 : min);
        return;
      }
      const parsed = mode === "decimal" ? Number.parseFloat(next) : Number.parseInt(next, 10);
      if (Number.isNaN(parsed)) {
        onChange(min <= 0 ? 0 : min);
        return;
      }
      onChange(clamp(parsed, min, max));
    },
    [max, min, mode, onChange],
  );

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode={mode === "decimal" ? "decimal" : "numeric"}
      value={draft}
      placeholder={placeholder}
      onFocus={(event) => {
        setIsFocused(true);
        if ((value ?? 0) === 0) event.target.select();
        event.target.style.borderColor = "var(--accent)";
      }}
      onBlur={(event) => {
        setIsFocused(false);
        commit(draft);
        setDraft(String(value === 0 && draft === "" ? 0 : clamp(Number.parseFloat(draft || "0") || 0, min, max)));
        event.target.style.borderColor = "var(--border-strong)";
      }}
      onChange={(event) => {
        const next = sanitizeNumericInput(event.target.value, mode);
        setDraft(next);
        commit(next);
      }}
      onKeyDown={(event) => {
        if (["e", "E", "+", "-"].includes(event.key)) event.preventDefault();
      }}
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-strong)",
        color: "var(--accent)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        padding: "6px 9px",
        borderRadius: 8,
        outline: "none",
        width: 80,
        textAlign: "center",
        transition: "border-color 0.15s ease, background 0.15s ease",
        ...style,
      }}
    />
  );
}
