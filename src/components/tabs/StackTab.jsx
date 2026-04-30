import { useCalc } from "../../lib/CalcContext.jsx";
import { STACK, STACK_CATS } from "../../data/stack.js";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import { getStackVariableState, getStackCost } from "../../lib/cost.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import ToggleRow from "../ui/ToggleRow.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import TextInput from "../ui/TextInput.jsx";
import SelectInput from "../ui/SelectInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function StackTab() {
  const {
    fx, stackOn, stackQty, stackVariable,
    toggleStack, setStackQuantity, updateStackVariable,
    customStack, customStackLabel, customStackCost,
    setCustomStackLabel, setCustomStackCost, addCustomStack, removeCustomStack,
  } = useCalc();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        SaaS, BaaS y serverless. Los costos variables ahora pueden modelarse por usuario, consumo o monto fijo.
      </div>
      {STACK_CATS.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {STACK.filter((item) => item.cat === category).map((item) => {
            const variable = getStackVariableState(stackVariable, item);
            const cost = getStackCost(item, stackQty, stackVariable);
            const isVariable = item.usd === 0;
            return (
              <ToggleRow
                key={item.id}
                checked={Boolean(stackOn[item.id])}
                onToggle={() => toggleStack(item.id)}
                label={item.label}
                sublabel={item.unit}
                note={item.note}
                right={stackOn[item.id] ? `${fmtUSD(cost)}/mes` : item.usd > 0 ? `${fmtUSD(item.usd)}/mes` : "variable"}
                controls={
                  stackOn[item.id] ? (
                    isVariable ? (
                      <>
                        <SelectInput
                          value={variable.mode}
                          onChange={(v) => updateStackVariable(item.id, "mode", v)}
                          options={[
                            { value: "per_user", label: "Por usuario" },
                            { value: "usage",    label: "Por consumo" },
                            { value: "fixed",    label: "Monto fijo" },
                          ]}
                        />
                        <NumericInput value={variable.rate} onChange={(v) => updateStackVariable(item.id, "rate", v)} min={0} max={100000} mode="decimal" style={{ width: 92 }} />
                        {variable.mode !== "fixed" ? (
                          <NumericInput value={variable.quantity} onChange={(v) => updateStackVariable(item.id, "quantity", v)} min={0} max={1000000} mode="decimal" style={{ width: 92 }} />
                        ) : null}
                        <TextInput value={variable.label} onChange={(v) => updateStackVariable(item.id, "label", v)} placeholder="unidad" style={{ width: 92 }} />
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>x</span>
                        <NumericInput value={stackQty[item.id] || 1} onChange={(v) => setStackQuantity(item.id, v)} min={1} max={500} />
                      </>
                    )
                  ) : null
                }
              />
            );
          })}
        </SectionCard>
      ))}

      <SectionCard>
        <CatHeader label="Stack personalizado" hint="USD/mes" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
          <TextInput value={customStackLabel} onChange={setCustomStackLabel} placeholder="Herramienta / SaaS" style={{ flex: 1, minWidth: 220 }} />
          <NumericInput value={customStackCost} onChange={setCustomStackCost} min={0} max={20000} mode="decimal" style={{ width: 120 }} />
          <ActionButton label="Agregar" onClick={addCustomStack} tone="accent" />
        </div>
        {customStack.length > 0 ? (
          <div style={{ padding: "0 16px 14px" }}>
            {customStack.map((entry) => (
              <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                </div>
                <ActionButton label="Eliminar" onClick={() => removeCustomStack(entry.id)} tone="subtle" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label="Sin stack personalizado." />
        )}
      </SectionCard>
    </div>
  );
}
