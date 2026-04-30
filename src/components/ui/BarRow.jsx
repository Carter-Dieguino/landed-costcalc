import { fmtUSD, pct } from "../../lib/format.js";

export default function BarRow({ label, usd, total, color }) {
  const width = total > 0 ? Math.max(2, pct(usd, total)) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
        <span style={{ color: "var(--text-2)" }}>{label}</span>
        <span style={{ color }}>{fmtUSD(usd)}/mes</span>
      </div>
      <div style={{ height: 7, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 999, transition: "width 0.35s ease" }} />
      </div>
      <div style={{ fontSize: 9, color: "var(--text-3)", marginTop: 3 }}>{pct(usd, total)}% del costo mensual</div>
    </div>
  );
}
