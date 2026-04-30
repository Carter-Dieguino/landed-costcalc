import { fmtUSD, fmtMXN } from "../../lib/format.js";

export default function SummaryMetric({ label, usd, mxn, color = "var(--text-1)", note }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</div>
        {note ? <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{note}</div> : null}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, color }}>{fmtUSD(usd)}</div>
        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(mxn)}</div>
      </div>
    </div>
  );
}
