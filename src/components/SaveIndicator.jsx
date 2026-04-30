import { useEffect, useState } from "react";
import { useCalc } from "../lib/CalcContext.jsx";

function relativeTime(savedAt, now) {
  const seconds = Math.max(0, Math.floor((now - savedAt) / 1000));
  if (seconds < 5) return "ahora";
  if (seconds < 60) return `hace ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `hace ${hours}h`;
}

export default function SaveIndicator() {
  const { lastSavedAt, isDirty } = useCalc();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (lastSavedAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  let label, color;
  if (isDirty) {
    label = "Guardando…";
    color = "var(--warning)";
  } else if (lastSavedAt != null) {
    label = `Guardado · ${relativeTime(lastSavedAt, now)}`;
    color = "var(--text-3)";
  } else {
    label = "Sin cambios";
    color = "var(--text-3)";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10,
        fontFamily: "var(--mono)",
        color,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: isDirty ? "var(--warning)" : lastSavedAt != null ? "var(--accent)" : "var(--text-3)",
          flexShrink: 0,
        }}
      />
      {label}
    </div>
  );
}
