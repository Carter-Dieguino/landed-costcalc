import { useCalc } from "../../lib/CalcContext.jsx";
import { INFRA, INFRA_CATS } from "../../data/infra.js";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import ToggleRow from "../ui/ToggleRow.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import TextInput from "../ui/TextInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function InfraTab() {
  const {
    fx, infraOn, infraQty, toggleInfra, setInfraQuantity,
    customInfra, customInfraLabel, customInfraCost,
    setCustomInfraLabel, setCustomInfraCost, addCustomInfra, removeCustomInfra,
  } = useCalc();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        Infra mensual de referencia · incluye Cloudflare Domains prorrateado
      </div>
      {INFRA_CATS.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {INFRA.filter((item) => item.cat === category).map((item) => (
            <ToggleRow
              key={item.id}
              checked={Boolean(infraOn[item.id])}
              onToggle={() => toggleInfra(item.id)}
              label={item.label}
              sublabel={item.note}
              right={`${fmtUSD(item.usd)}/mes`}
              controls={
                infraOn[item.id] ? (
                  <>
                    <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                    <NumericInput value={infraQty[item.id] || 1} onChange={(v) => setInfraQuantity(item.id, v)} min={1} max={200} />
                    <div style={{ minWidth: 110, textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--accent)" }}>{fmtUSD(item.usd * (infraQty[item.id] || 1))}</div>
                      <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtMXN(item.usd * (infraQty[item.id] || 1) * fx)}</div>
                    </div>
                  </>
                ) : null
              }
            />
          ))}
        </SectionCard>
      ))}

      <SectionCard>
        <CatHeader label="Infra personalizada" hint="USD/mes" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
          <TextInput value={customInfraLabel} onChange={setCustomInfraLabel} placeholder="Proveedor / servicio" style={{ flex: 1, minWidth: 220 }} />
          <NumericInput value={customInfraCost} onChange={setCustomInfraCost} min={0} max={20000} mode="decimal" style={{ width: 120 }} />
          <ActionButton label="Agregar" onClick={addCustomInfra} tone="accent" />
        </div>
        {customInfra.length > 0 ? (
          <div style={{ padding: "0 16px 14px" }}>
            {customInfra.map((entry) => (
              <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                </div>
                <ActionButton label="Eliminar" onClick={() => removeCustomInfra(entry.id)} tone="subtle" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label="Sin infraestructura personalizada." />
        )}
      </SectionCard>
    </div>
  );
}
