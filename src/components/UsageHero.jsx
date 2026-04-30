import { useCalc } from "../lib/CalcContext.jsx";
import { MODE_OPTIONS, USAGE_STEPS_BY_MODE } from "../lib/constants.js";
import SectionCard from "./ui/SectionCard.jsx";

export default function UsageHero() {
  const { mode, themeMode } = useCalc();
  const steps = USAGE_STEPS_BY_MODE[mode] || USAGE_STEPS_BY_MODE.project;
  return (
    <SectionCard style={{ background: "var(--hero-bg)", borderColor: "var(--hero-border)" }}>
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Modo {MODE_OPTIONS.find((m) => m.value === mode)?.label}
            </div>
            <div style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--text-1)", marginTop: 2 }}>
              {mode === "freelancer" ? "Tarifa por hora sostenible" : mode === "org" ? "Burn rate de la operación" : "Cotización por proyecto"}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-2)" }}>Tema actual: {themeMode === "system" ? "Sistema" : themeMode}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {steps.map((step, index) => (
            <div key={step} style={{ padding: 12, borderRadius: 14, background: "var(--surface-0)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 9, color: "var(--accent)", letterSpacing: "0.16em", marginBottom: 6 }}>PASO 0{index + 1}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
