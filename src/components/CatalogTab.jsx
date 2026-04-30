import { fmtUSD, fmtMXN } from "../lib/format.js";
import { getCatalogItemUSD } from "../lib/cost.js";
import SectionCard from "./ui/SectionCard.jsx";
import CatHeader from "./ui/CatHeader.jsx";
import ToggleRow from "./ui/ToggleRow.jsx";
import NumericInput from "./ui/NumericInput.jsx";

export default function CatalogTab({ catalog, cats, onMap, qtyMap, toggle, setQty, fx, totalPersonas, intro }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {intro ? (
        <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{intro}</div>
      ) : null}
      {cats.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {catalog.filter((item) => item.cat === category).map((item) => {
            const baseUSD = getCatalogItemUSD(item, fx);
            let qty = qtyMap[item.id];
            if (qty === undefined || qty === null) qty = item.perPerson ? Math.max(1, totalPersonas) : 1;
            const totalUSD = baseUSD * qty;
            const baseLabel = typeof item.usd === "number" ? `${fmtUSD(item.usd)}/mes` : `${fmtMXN(item.mxn)}/mes`;
            return (
              <ToggleRow
                key={item.id}
                checked={Boolean(onMap[item.id])}
                onToggle={() => toggle(item.id)}
                label={item.label}
                sublabel={item.note}
                note={item.perPerson ? "Por persona — multiplica por personas activas" : null}
                right={onMap[item.id] ? `${fmtUSD(totalUSD)}/mes` : baseLabel}
                controls={
                  onMap[item.id] ? (
                    <>
                      <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                      <NumericInput value={qty} onChange={(v) => setQty(item.id, v)} min={1} max={500} />
                      <div style={{ minWidth: 110, textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "var(--accent)" }}>{fmtUSD(totalUSD)}</div>
                        <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtMXN(totalUSD * fx)}</div>
                      </div>
                    </>
                  ) : null
                }
              />
            );
          })}
        </SectionCard>
      ))}
    </div>
  );
}
