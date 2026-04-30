import { useCalc } from "../../lib/CalcContext.jsx";
import { ROLES, ROLE_CATS } from "../../data/roles.js";
import { ISN_ESTADOS } from "../../data/fiscal.js";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import { getRoleMonthlyMXN } from "../../lib/cost.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import TextInput from "../ui/TextInput.jsx";
import SelectInput from "../ui/SelectInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function HumanTab() {
  const {
    mode, fx, costs, cargaSocialFactor,
    includeCargaSocial, setIncludeCargaSocial,
    mxState, setMxState, aguinaldo30, setAguinaldo30,
    includePTUFactor, setIncludePTUFactor,
    includeNOM037, setIncludeNOM037, nom037MXN, setNom037MXN,
    teamCount, teamSeniority, setCount, setSen,
    customHumans, customHumanLabel, customHumanCost,
    setCustomHumanLabel, setCustomHumanCost, addCustomHuman, removeCustomHuman,
  } = useCalc();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {mode === "freelancer"
          ? "Modo Freelancer · selecciona TU rol y mete tu objetivo de ingreso bruto mensual"
          : "Sueldos de mercado México 2026 · carga social desglosada"}
      </div>
      {mode !== "freelancer" ? (
        <SectionCard>
          <CatHeader label="Carga social y región" hint={includeCargaSocial ? `Factor real ${(cargaSocialFactor * 100).toFixed(1)}%` : "Sin carga social"} />
          <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, alignItems: "end" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
              <input type="checkbox" checked={includeCargaSocial} onChange={(e) => setIncludeCargaSocial(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
              Incluir carga social MX
            </label>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ESTADO (ISN)</div>
              <SelectInput
                value={mxState}
                onChange={setMxState}
                options={ISN_ESTADOS.map((s) => ({ value: s.id, label: `${s.label} · ${(s.tasa * 100).toFixed(2)}%` }))}
                style={{ width: "100%" }}
              />
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
              <input type="checkbox" checked={aguinaldo30} onChange={(e) => setAguinaldo30(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
              Aguinaldo 30 días (costumbre tech)
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
              <input type="checkbox" checked={includePTUFactor} onChange={(e) => setIncludePTUFactor(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
              Provisionar PTU (10% util.)
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
              <input type="checkbox" checked={includeNOM037} onChange={(e) => setIncludeNOM037(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
              NOM-037 home office (obligatoria si {">"}40% remoto)
            </label>
            {includeNOM037 ? (
              <div>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>SUBSIDIO MXN/PERSONA/MES</div>
                <NumericInput value={nom037MXN} onChange={setNom037MXN} min={0} max={10000} style={{ width: "100%" }} />
              </div>
            ) : null}
          </div>
          <div style={{ padding: "0 16px 14px", fontSize: 10, color: "var(--text-3)", lineHeight: 1.7 }}>
            Desglose: IMSS 18.2% · INFONAVIT 5.4% · Aguinaldo {aguinaldo30 ? "8.3%" : "4.2%"} · Prima vac 0.8%{includePTUFactor ? " · PTU 4.2%" : ""} · ISN {(ISN_ESTADOS.find((s) => s.id === mxState)?.tasa * 100 || 3).toFixed(2)}%. CEAV escalonada hasta 2030. Verificar tasas anualmente.
          </div>
        </SectionCard>
      ) : (
        <SectionCard>
          <CatHeader label="Modo Freelancer" hint="Sin relación patronal" />
          <div style={{ padding: "12px 16px", fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
            Como freelancer no aplican IMSS patronal, INFONAVIT, ISN, aguinaldo ni PTU. Tu fiscalidad va por la pestaña <strong style={{ color: "var(--accent)" }}>Fiscal MX</strong> (RESICO PF, PF Honorarios). Selecciona <em>tu</em> perfil más abajo y mete el ingreso bruto mensual al que apuntas; el costo real lo defines con infra, software y administración personal en las otras pestañas.
          </div>
        </SectionCard>
      )}

      {ROLE_CATS.map((category) => (
        <SectionCard key={category}>
          <CatHeader label={category} />
          {ROLES.filter((role) => role.cat === category).map((role) => {
            const count = teamCount[role.id] || 0;
            const seniority = teamSeniority[role.id] || "mid";
            const baseMonthly = getRoleMonthlyMXN(role, seniority);
            const effectiveMonthly = baseMonthly * (1 + cargaSocialFactor);
            return (
              <div key={role.id} style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) 150px 120px 120px 85px 120px", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{role.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(role.minMXN)} - {fmtMXN(role.maxMXN)}</div>
                </div>
                <SelectInput
                  value={seniority}
                  onChange={(v) => setSen(role.id, v)}
                  options={[
                    { value: "min", label: "Junior" },
                    { value: "mid", label: "Mid" },
                    { value: "max", label: "Senior" },
                  ]}
                />
                <div style={{ fontSize: 11, color: "var(--text-2)", textAlign: "right" }}>
                  {fmtMXN(effectiveMonthly)}/mes
                  <div style={{ fontSize: 9, color: "var(--text-3)" }}>{fmtUSD(effectiveMonthly / fx)}</div>
                </div>
                <NumericInput value={count} onChange={(v) => setCount(role.id, v)} min={0} max={30} />
                <div style={{ fontSize: 10, color: "var(--text-3)", textAlign: "center" }}>personas</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: count > 0 ? "var(--accent)" : "var(--text-3)" }}>{count > 0 ? fmtMXN(effectiveMonthly * count) : "-"}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{count > 0 ? fmtUSD((effectiveMonthly * count) / fx) : ""}</div>
                </div>
              </div>
            );
          })}
        </SectionCard>
      ))}

      <SectionCard>
        <CatHeader label="Perfiles personalizados" hint="MXN/mes" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px" }}>
          <TextInput value={customHumanLabel} onChange={setCustomHumanLabel} placeholder="Nombre del perfil" style={{ flex: 1, minWidth: 220 }} />
          <NumericInput value={customHumanCost} onChange={setCustomHumanCost} min={0} max={500000} style={{ width: 120 }} />
          <ActionButton label="Agregar" onClick={addCustomHuman} tone="accent" />
        </div>
        {customHumans.length > 0 ? (
          <div style={{ padding: "0 16px 14px" }}>
            {customHumans.map((entry) => (
              <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{entry.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(entry.mxn)} / {fmtUSD(entry.mxn / fx)}</div>
                </div>
                <ActionButton label="Eliminar" onClick={() => removeCustomHuman(entry.id)} tone="subtle" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label="Sin perfiles personalizados." />
        )}
      </SectionCard>

      <SectionCard>
        <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Total mensual</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "var(--accent)" }}>{fmtMXN(costs.humanMXN)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "var(--text-2)" }}>{fmtUSD(costs.humanUSD)}/mes</div>
            <div style={{ fontSize: 10, color: "var(--text-3)" }}>Incluye prestaciones si el switch esta activo</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
