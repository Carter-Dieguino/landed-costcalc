import { useCalc } from "../../lib/CalcContext.jsx";
import { AI_PROVIDERS, AI_CATS } from "../../data/ai.js";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import { getAIUsageState, getAICost, describeAIItem } from "../../lib/cost.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import ToggleRow from "../ui/ToggleRow.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import TextInput from "../ui/TextInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function AITab() {
  const {
    fx, aiOn, aiUsage, toggleAI, updateAIUsage,
    customAI, customAILabel, customAICost,
    setCustomAILabel, setCustomAICost, addCustomAI, removeCustomAI,
  } = useCalc();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        Incluye APIs, modelos open source, Ollama self-host, fine-tuning, vision por computadora y escenarios 3D.
      </div>
      {AI_CATS.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {AI_PROVIDERS.filter((item) => item.cat === category).map((item) => {
            const usage = getAIUsageState(aiUsage, item);
            const cost = getAICost(item, aiUsage);
            return (
              <ToggleRow
                key={item.id}
                checked={Boolean(aiOn[item.id])}
                onToggle={() => toggleAI(item.id)}
                label={item.label}
                sublabel={describeAIItem(item, fmtUSD)}
                right={aiOn[item.id] ? `${fmtUSD(cost)}/mes` : item.billing === "monthly" ? `${fmtUSD(item.monthlyUSD || 0)}/mes` : item.billing === "usage" ? `${fmtUSD(item.rateUSD || 0)}/${item.unitLabel}` : "tokens"}
                controls={
                  aiOn[item.id] ? (
                    item.billing === "tokens" ? (
                      <>
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>M tok in</span>
                        <NumericInput value={usage.tokensM} onChange={(v) => updateAIUsage(item.id, "tokensM", v)} min={0} max={100000} mode="decimal" style={{ width: 88 }} />
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>M tok out</span>
                        <NumericInput value={usage.outputTokensM ?? 0} onChange={(v) => updateAIUsage(item.id, "outputTokensM", v)} min={0} max={100000} mode="decimal" style={{ width: 88 }} />
                      </>
                    ) : item.billing === "usage" ? (
                      <>
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(item.rateUSD || 0)}/u</span>
                        <NumericInput value={usage.units} onChange={(v) => updateAIUsage(item.id, "units", v)} min={0} max={1000000} mode="decimal" style={{ width: 96 }} />
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>{item.unitLabel}</span>
                      </>
                    ) : null
                  ) : null
                }
              />
            );
          })}
        </SectionCard>
      ))}

      <SectionCard>
        <CatHeader label="IA personalizada" hint="USD/mes" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
          <TextInput value={customAILabel} onChange={setCustomAILabel} placeholder="Experimento / modelo / GPU" style={{ flex: 1, minWidth: 220 }} />
          <NumericInput value={customAICost} onChange={setCustomAICost} min={0} max={30000} mode="decimal" style={{ width: 120 }} />
          <ActionButton label="Agregar" onClick={addCustomAI} tone="accent" />
        </div>
        {customAI.length > 0 ? (
          <div style={{ padding: "0 16px 14px" }}>
            {customAI.map((entry) => (
              <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtUSD(entry.usd)} / {fmtMXN(entry.usd * fx)}</div>
                </div>
                <ActionButton label="Eliminar" onClick={() => removeCustomAI(entry.id)} tone="subtle" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label="Sin IA personalizada." />
        )}
      </SectionCard>
    </div>
  );
}
