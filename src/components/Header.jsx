import { useCalc } from "../lib/CalcContext.jsx";
import { fmtUSD, fmtMXN } from "../lib/format.js";
import { MODE_OPTIONS, TABS, TAB_GROUPS, THEME_OPTIONS } from "../lib/constants.js";
import NumericInput from "./ui/NumericInput.jsx";
import SelectInput from "./ui/SelectInput.jsx";
import ActionButton from "./ui/ActionButton.jsx";
import SaveIndicator from "./SaveIndicator.jsx";

export default function Header() {
  const {
    mode, setMode, tab, setTab, themeMode, setThemeMode,
    fx, setFx, fxAuto, setFxAuto, fxStatus, fetchFx,
    hoursPerMonth, setHoursPerMonth,
    months, setMonths, margin, setMargin, contingency, setContingency,
    costs, resetTab, resetAll,
  } = useCalc();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid var(--border)", backdropFilter: "blur(14px)", background: "var(--header-bg)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.05em" }}>
                COST<span style={{ color: "var(--accent)" }}>CALC</span>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>MX estimator</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>
              Calculadora operativa para cotizar software, nube, SaaS, IA y fiscalidad de forma mas realista.
            </div>
            <div style={{ marginTop: 10, display: "inline-flex", gap: 4, padding: 3, border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface-0)" }}>
              {MODE_OPTIONS.map((option) => {
                const active = mode === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setMode(option.value)}
                    title={option.desc}
                    style={{
                      border: "none",
                      background: active ? "var(--accent)" : "transparent",
                      color: active ? "#08120d" : "var(--text-2)",
                      padding: "6px 12px", borderRadius: 999,
                      fontFamily: "var(--mono)", fontSize: 10,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <span>TC MXN/USD</span>
                <button
                  onClick={() => { setFxAuto(true); fetchFx(); }}
                  title="Actualizar TC en vivo"
                  style={{ background: "transparent", border: "none", color: fxStatus === "ok" ? "var(--accent)" : fxStatus === "loading" ? "var(--warning)" : fxStatus === "error" ? "var(--danger)" : "var(--text-3)", fontSize: 9, cursor: "pointer", padding: 0 }}
                >
                  {fxStatus === "loading" ? "..." : fxStatus === "ok" ? "LIVE" : fxStatus === "error" ? "ERR" : "AUTO"}
                </button>
              </div>
              <NumericInput value={fx} onChange={(v) => { setFx(v); setFxAuto(false); }} min={10} max={30} step={0.1} mode="decimal" />
            </div>
            {mode === "freelancer" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>HRS / MES</div>
                <NumericInput value={hoursPerMonth} onChange={setHoursPerMonth} min={1} max={400} />
              </div>
            ) : mode === "project" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>MESES</div>
                <NumericInput value={months} onChange={setMonths} min={1} max={60} />
              </div>
            ) : null}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>MARGEN %</div>
              <NumericInput value={margin} onChange={setMargin} min={0} max={200} />
            </div>
            {mode === "project" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>CONTINGENCIA %</div>
                <NumericInput value={contingency} onChange={setContingency} min={0} max={50} />
              </div>
            ) : null}

            <div style={{ minWidth: 140, paddingLeft: 12, borderLeft: "1px solid var(--border)" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--text-3)", marginBottom: 4 }}>
                {mode === "freelancer" ? "TARIFA / HORA" : mode === "org" ? "BURN MENSUAL" : "COSTO MENSUAL"}
              </div>
              <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 900, color: "var(--accent)" }}>
                {mode === "freelancer" ? fmtUSD(costs.hourlyClientUSD) : mode === "org" ? fmtUSD(costs.monthlyWithMargin) : fmtUSD(costs.monthlyUSD)}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                {mode === "freelancer"
                  ? `${fmtMXN(costs.hourlyClientUSD * fx)}/hr · costo ${fmtUSD(costs.hourlyCostUSD)}`
                  : mode === "org"
                  ? `Anual ${fmtUSD(costs.annualWithMarginUSD)}`
                  : fmtMXN(costs.monthlyUSD * fx)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", overflowX: "auto", gap: 6, paddingBottom: 2, alignItems: "center" }}>
            {TAB_GROUPS.map((group, gIndex) => {
              const tabsInGroup = TABS.filter((t) => t.group === group.id && t.modes.includes(mode));
              if (tabsInGroup.length === 0) return null;
              return (
                <div key={group.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {gIndex > 0 ? (
                    <div
                      aria-hidden
                      style={{ width: 1, height: 18, background: "var(--border)", margin: "0 4px", flexShrink: 0 }}
                    />
                  ) : null}
                  <span
                    style={{
                      fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase",
                      color: group.color, opacity: 0.7, paddingRight: 4, whiteSpace: "nowrap", userSelect: "none",
                    }}
                  >
                    {group.label}
                  </span>
                  {tabsInGroup.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      style={{
                        border: "none",
                        background: tab === item.id ? "var(--surface-1)" : "transparent",
                        color: tab === item.id ? group.color : "var(--text-3)",
                        padding: "9px 12px", borderRadius: 999,
                        fontFamily: "var(--mono)", fontSize: 11, whiteSpace: "nowrap",
                        boxShadow: tab === item.id ? `inset 0 0 0 1px ${group.color}` : "none",
                        cursor: "pointer",
                      }}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <SaveIndicator />
            <SelectInput value={themeMode} onChange={setThemeMode} options={THEME_OPTIONS} style={{ minWidth: 110 }} />
            <ActionButton label="Limpiar pestaña" onClick={() => resetTab(tab)} tone="subtle" />
            <ActionButton label="Limpiar todo" onClick={resetAll} tone="accent" />
          </div>
        </div>
      </div>
    </header>
  );
}
