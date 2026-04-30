import { useMemo } from "react";
import { useCalc } from "../../lib/CalcContext.jsx";
import {
  REGIMENES, calcISRFisicaAnual,
  RETENCIONES_EXTRANJERO, US_FEDERAL_2026, US_ESTATAL, MULTAS_SAT_COMUNES,
} from "../../data/fiscal.js";
import { fmtMXN } from "../../lib/format.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import SummaryMetric from "../ui/SummaryMetric.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import SelectInput from "../ui/SelectInput.jsx";

export default function FiscalTab() {
  const {
    fx, costs, selectedRegimen,
    fiscalRegimen, setFiscalRegimen, isrIncome, setIsrIncome,
    extranjeroPagoUSD, setExtranjeroPagoUSD,
    extranjeroTratadoUSA, setExtranjeroTratadoUSA,
    extranjeroConcepto, setExtranjeroConcepto,
    ivaImportDigital, setIvaImportDigital,
    ivaExportacion, setIvaExportacion,
    usEstadoSel, setUsEstadoSel, usSalaryUSD, setUsSalaryUSD,
  } = useCalc();

  const isrAnual = useMemo(() => calcISRFisicaAnual(isrIncome), [isrIncome]);

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 920 }}>
      <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Tributacion Mexico 2026 · orientativo</div>
      <SectionCard>
        <CatHeader label="Regimen fiscal" />
        <div style={{ padding: "16px", display: "grid", gap: 10 }}>
          {REGIMENES.map((regimen) => (
            <button
              key={regimen.id}
              onClick={() => setFiscalRegimen(regimen.id)}
              style={{
                textAlign: "left",
                borderRadius: 14,
                border: `1px solid ${fiscalRegimen === regimen.id ? "var(--accent)" : "var(--border)"}`,
                background: fiscalRegimen === regimen.id ? "var(--accent-soft)" : "var(--surface-0)",
                padding: "12px 14px",
                color: "var(--text-1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13 }}>{regimen.label}</span>
                <span style={{ fontSize: 11, color: "var(--warning)" }}>ISR efectivo ~{Math.round(regimen.isrEfectivo * 100)}%</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{regimen.perfil}</div>
              <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 4 }}>{regimen.ventajas}</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>Consideraciones: {regimen.consideraciones}</div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label={`Impacto estimado - ${selectedRegimen.label}`} />
        <div style={{ padding: "14px 18px" }}>
          <SummaryMetric label="Precio base al cliente" usd={costs.withMargin} mxn={costs.withMargin * fx} color="var(--text-1)" note="Sin IVA" />
          <SummaryMetric label="IVA trasladado" usd={costs.withMargin * 0.16} mxn={costs.withMargin * 0.16 * fx} color="var(--warning)" note="Se cobra, no es utilidad" />
          <SummaryMetric label="ISR estimado" usd={costs.estimatedISR} mxn={costs.estimatedISR * fx} color="var(--danger)" note={`${Math.round(selectedRegimen.isrEfectivo * 100)}% sobre utilidad bruta operativa`} />
          <SummaryMetric label="PTU estimada" usd={costs.estimatedPTU} mxn={costs.estimatedPTU * fx} color="var(--danger)" note="Solo si tienes empleados" />
          <SummaryMetric label="Utilidad neta estimada" usd={costs.estimatedNet} mxn={costs.estimatedNet * fx} color="var(--accent-alt)" note="Despues de comisiones, ISR y PTU" />
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="Calculadora ISR Persona Fisica" hint="Tabla Art. 152" />
        <div style={{ padding: "16px 18px", display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>INGRESO ANUAL MXN</div>
              <NumericInput value={isrIncome} onChange={setIsrIncome} min={0} max={100000000} style={{ width: 140 }} />
            </div>
            <div style={{ padding: 14, background: "var(--surface-0)", borderRadius: 14, border: "1px solid var(--border)", minWidth: 220 }}>
              <div style={{ fontSize: 10, color: "var(--text-3)" }}>ISR anual estimado</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "var(--warning)" }}>{fmtMXN(isrAnual)}</div>
              <div style={{ fontSize: 10, color: "var(--text-3)" }}>Mensual aprox: {fmtMXN(isrAnual / 12)}</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.8 }}>
            <div>RESICO PF tope alto: {fmtMXN(isrIncome * 0.025)}</div>
            <div>PM general orientativo: {fmtMXN(isrIncome * 0.3)}</div>
            <div>PM RESICO orientativo: {fmtMXN(isrIncome * 0.01)}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="Retención a residentes en el extranjero" hint="LISR Título V" />
        <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
            Cuando pagas a OpenAI, Anthropic, AWS, GitHub, Stripe Inc desde MX, técnicamente debes retener ISR sobre el pago. Si el proveedor presenta forma 6166 IRS (residencia fiscal USA), aplicas tratado y la retención baja a 10%. Si NO retienes, el SAT puede no permitir deducir el gasto.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>CONCEPTO</div>
              <SelectInput
                value={extranjeroConcepto}
                onChange={setExtranjeroConcepto}
                options={RETENCIONES_EXTRANJERO.map((r) => ({ value: r.id, label: r.label }))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>PAGO MENSUAL USD</div>
              <NumericInput value={extranjeroPagoUSD} onChange={setExtranjeroPagoUSD} min={0} max={1000000} mode="decimal" style={{ width: "100%" }} />
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
              <input type="checkbox" checked={extranjeroTratadoUSA} onChange={(e) => setExtranjeroTratadoUSA(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
              Aplicar tratado MX-USA
            </label>
          </div>
          {(() => {
            const concepto = RETENCIONES_EXTRANJERO.find((r) => r.id === extranjeroConcepto);
            const tasa = extranjeroTratadoUSA ? concepto.tratadoUSA : concepto.general;
            const retencion = (extranjeroPagoUSD || 0) * tasa;
            return (
              <>
                <SummaryMetric label={`Retención aplicable (${(tasa * 100).toFixed(1)}%)`} usd={retencion} mxn={retencion * fx} color="var(--warning)" note={concepto.note} />
                <SummaryMetric label="IVA importación digital (Netflix tax)" usd={ivaImportDigital ? (extranjeroPagoUSD || 0) * 0.16 : 0} mxn={ivaImportDigital ? (extranjeroPagoUSD || 0) * 0.16 * fx : 0} color="var(--accent-blue)" note="Auto-acumulación 16% si proveedor sin RFC MX" />
              </>
            );
          })()}
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
            <input type="checkbox" checked={ivaImportDigital} onChange={(e) => setIvaImportDigital(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
            Activar auto-acumulación IVA importación (proveedor sin RFC MX)
          </label>
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="IVA tasa 0% por exportación de servicios" hint="LIVA art. 29-IV" />
        <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.7 }}>
            Si facturas USD a empresa en el extranjero por servicios aprovechados allá, aplicas IVA tasa 0%. Te permite acreditar el IVA pagado en MX y solicitar devolución (típico 6-9 meses post-solicitud). Oportunidad enorme para tech que exporta a USA.
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--text-2)" }}>
            <input type="checkbox" checked={ivaExportacion} onChange={(e) => setIvaExportacion(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
            Esta cotización es una exportación de servicios (cliente en USA / extranjero)
          </label>
          {ivaExportacion ? (
            <>
              <SummaryMetric label="IVA aplicado al cliente" usd={0} mxn={0} color="var(--accent)" note="Tasa 0% — cliente extranjero no paga IVA" />
              <SummaryMetric label="IVA acreditable estimado (16% del costo MX)" usd={(costs.humanUSD + costs.adminUSD + costs.oficinaUSD) * 0.16} mxn={(costs.humanUSD + costs.adminUSD + costs.oficinaUSD) * 0.16 * fx} color="var(--accent-blue)" note="Recuperable vía devolución SAT" />
            </>
          ) : (
            <SummaryMetric label="IVA trasladado al cliente" usd={costs.withMargin * 0.16} mxn={costs.withMargin * 0.16 * fx} color="var(--warning)" note="16% sobre precio final · cliente MX" />
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="Calculadora US Payroll (referencia)" hint="Federal + estatal 2026" />
        <div style={{ padding: "16px 18px", display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ESTADO</div>
              <SelectInput
                value={usEstadoSel}
                onChange={setUsEstadoSel}
                options={US_ESTATAL.map((s) => ({ value: s.id, label: s.label }))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>SALARIO ANUAL USD</div>
              <NumericInput value={usSalaryUSD} onChange={setUsSalaryUSD} min={0} max={1000000} style={{ width: "100%" }} />
            </div>
          </div>
          {(() => {
            const est = US_ESTATAL.find((s) => s.id === usEstadoSel);
            const ss = Math.min(usSalaryUSD, US_FEDERAL_2026.ssEmployer.wageBaseUSD) * US_FEDERAL_2026.ssEmployer.tasa;
            const medicare = usSalaryUSD * US_FEDERAL_2026.medicare.tasa;
            const futa = US_FEDERAL_2026.futa.wageBaseUSD * US_FEDERAL_2026.futa.tasa;
            const sui = (est.sui.wageBaseUSD || 0) * (est.sui.tasa || 0);
            const totalEmployerTax = ss + medicare + futa + sui;
            const totalCostUS = usSalaryUSD + totalEmployerTax;
            const factor = usSalaryUSD > 0 ? totalCostUS / usSalaryUSD : 1;
            return (
              <>
                <SummaryMetric label={`SS patrón (cap $${US_FEDERAL_2026.ssEmployer.wageBaseUSD.toLocaleString()})`} usd={ss} mxn={ss * fx} color="var(--warning)" />
                <SummaryMetric label="Medicare 1.45% (sin tope)" usd={medicare} mxn={medicare * fx} color="var(--warning)" />
                <SummaryMetric label="FUTA efectiva 0.6% sobre $7k" usd={futa} mxn={futa * fx} color="var(--warning)" />
                <SummaryMetric label={`SUI ${est.label}`} usd={sui} mxn={sui * fx} color="var(--warning)" note={est.sui.note || ""} />
                <SummaryMetric label="Costo total empleador (anual)" usd={totalCostUS} mxn={totalCostUS * fx} color="var(--accent)" note={`Factor ${factor.toFixed(3)}× sobre salario base`} />
                <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.7 }}>
                  Otros estatales {est.label}: {(est.otros || []).join(" · ") || "—"}. No incluido: health PPO ~$680/PEPM single, 401(k) match, dental/vision/STD/LTD, PTO ~11%.
                </div>
              </>
            );
          })()}
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="Multas SAT comunes" hint="Para no olvidar obligaciones" />
        <div style={{ padding: "10px 16px" }}>
          {MULTAS_SAT_COMUNES.map((multa) => (
            <div key={multa.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
              <div>
                <div style={{ color: "var(--text-1)" }}>{multa.label}</div>
                <div style={{ fontSize: 10, color: "var(--text-3)" }}>{multa.note}</div>
              </div>
              <div style={{ textAlign: "right", color: "var(--danger)" }}>
                {fmtMXN(multa.minMXN)} – {fmtMXN(multa.maxMXN)}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
