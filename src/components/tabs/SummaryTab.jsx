import { useCalc } from "../../lib/CalcContext.jsx";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import { exportTXT } from "../../lib/export.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import SummaryMetric from "../ui/SummaryMetric.jsx";
import BarRow from "../ui/BarRow.jsx";
import TextInput from "../ui/TextInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";

export default function SummaryTab() {
  const {
    mode, fx, costs, project, setProj,
    months, margin, contingency,
    teamCount, teamSeniority, customHumans,
    infraOn, infraQty, customInfra,
    stackOn, stackQty, stackVariable, customStack,
    aiOn, aiUsage, customAI,
    sellers, selectedRegimen,
    triggerImport, exportConfig, fileInputRef, handleFileChange,
  } = useCalc();

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <SectionCard>
        <CatHeader label={mode === "freelancer" ? "Mi perfil" : mode === "org" ? "Organización" : "Proyecto"} hint="Estos datos salen en la exportacion" />
        <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 140px auto", gap: 12, alignItems: "end" }}>
          <div>
            <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>
              {mode === "freelancer" ? "MI NOMBRE" : mode === "org" ? "ORGANIZACIÓN" : "NOMBRE"}
            </div>
            <TextInput value={project.name} onChange={(v) => setProj("name", v)} placeholder={mode === "freelancer" ? "Tu nombre" : mode === "org" ? "Nombre de la empresa" : "Mi sistema / app"} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>
              {mode === "freelancer" ? "ESPECIALIDAD" : mode === "org" ? "RFC / TAX ID" : "CLIENTE"}
            </div>
            <TextInput value={project.client} onChange={(v) => setProj("client", v)} placeholder={mode === "freelancer" ? "Ej. Backend / Diseño UI" : mode === "org" ? "RFC u opcional" : "Empresa ABC"} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>VERSION</div>
            <TextInput value={project.version} onChange={(v) => setProj("version", v)} placeholder="1.0" style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <ActionButton label="Cargar .json" onClick={triggerImport} tone="subtle" />
            <ActionButton label="Guardar .json" onClick={exportConfig} tone="neutral" />
            <ActionButton
              label="Exportar .txt"
              onClick={() =>
                exportTXT({
                  project, costs, fx, months, margin, contingency,
                  teamCount, teamSeniority,
                  infraOn, infraQty,
                  stackOn, stackQty, stackVariable,
                  aiOn, aiUsage,
                  sellers,
                  customHumans, customInfra, customStack, customAI,
                  fiscalLabel: selectedRegimen.label,
                })
              }
              tone="accent"
            />
            <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} style={{ display: "none" }} />
          </div>
        </div>
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>DESCRIPCION</div>
          <textarea
            value={project.description}
            onChange={(e) => setProj("description", e.target.value)}
            rows={3}
            style={{ width: "100%", resize: "vertical", background: "var(--surface-0)", border: "1px solid var(--border-strong)", borderRadius: 12, color: "var(--text-1)", fontFamily: "var(--mono)", fontSize: 11, padding: "10px 12px", lineHeight: 1.6, outline: "none" }}
            placeholder="Alcance, entregables, exclusiones, supuestos..."
          />
        </div>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ display: "grid", gap: 18 }}>
          <SectionCard>
            <CatHeader label="Desglose mensual" />
            <div style={{ padding: "16px 18px" }}>
              <BarRow label="Capital humano" usd={costs.humanUSD} total={costs.monthlyUSD} color="var(--accent)" />
              <BarRow label="Equipos" usd={costs.equiposUSD} total={costs.monthlyUSD} color="var(--accent-blue)" />
              <BarRow label="Oficina & conectividad" usd={costs.oficinaUSD} total={costs.monthlyUSD} color="var(--warning)" />
              <BarRow label="Infraestructura" usd={costs.infraUSD} total={costs.monthlyUSD} color="var(--accent-blue)" />
              <BarRow label="Stack & SaaS" usd={costs.stackUSD} total={costs.monthlyUSD} color="var(--warning)" />
              <BarRow label="IA & ML" usd={costs.aiUSD} total={costs.monthlyUSD} color="var(--accent-alt)" />
              <BarRow label="Beneficios" usd={costs.benefUSD} total={costs.monthlyUSD} color="var(--accent)" />
              <BarRow label="Movilidad" usd={costs.movilUSD} total={costs.monthlyUSD} color="var(--danger)" />
              <BarRow label="Admin & legal" usd={costs.adminUSD} total={costs.monthlyUSD} color="var(--text-2)" />
            </div>
          </SectionCard>

          <SectionCard>
            <CatHeader label="Costos mensuales" />
            <div style={{ padding: "0 18px 12px" }}>
              <SummaryMetric label="Capital humano" usd={costs.humanUSD} mxn={costs.humanMXN} color="var(--accent)" />
              <SummaryMetric label="Equipos" usd={costs.equiposUSD} mxn={costs.equiposUSD * fx} color="var(--accent-blue)" />
              <SummaryMetric label="Oficina & conect." usd={costs.oficinaUSD} mxn={costs.oficinaUSD * fx} color="var(--warning)" />
              <SummaryMetric label="Infraestructura" usd={costs.infraUSD} mxn={costs.infraUSD * fx} color="var(--accent-blue)" />
              <SummaryMetric label="Stack & SaaS" usd={costs.stackUSD} mxn={costs.stackUSD * fx} color="var(--warning)" />
              <SummaryMetric label="IA & ML" usd={costs.aiUSD} mxn={costs.aiUSD * fx} color="var(--accent-alt)" />
              <SummaryMetric label="Beneficios" usd={costs.benefUSD} mxn={costs.benefUSD * fx} color="var(--accent)" />
              <SummaryMetric label="Movilidad" usd={costs.movilUSD} mxn={costs.movilUSD * fx} color="var(--danger)" />
              <SummaryMetric label="Admin & legal" usd={costs.adminUSD} mxn={costs.adminUSD * fx} color="var(--text-2)" />
              <SummaryMetric label="Total mensual" usd={costs.monthlyUSD} mxn={costs.monthlyUSD * fx} color="var(--text-1)" />
            </div>
          </SectionCard>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <SectionCard style={{ background: "var(--hero-bg)", borderColor: "var(--hero-border)" }}>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                {mode === "freelancer" ? "Tarifa al cliente" : mode === "org" ? "Revenue mínimo mensual" : "Precio final"}
              </div>
              <div style={{ marginTop: 10, fontFamily: "var(--display)", fontSize: 38, fontWeight: 900, color: "var(--accent)" }}>
                {mode === "freelancer" ? fmtUSD(costs.hourlyClientUSD) + "/hr" : mode === "org" ? fmtUSD(costs.monthlyWithMargin) + "/mes" : fmtUSD(costs.withMargin)}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)", marginTop: 4 }}>
                {mode === "freelancer"
                  ? `${fmtMXN(costs.hourlyClientUSD * fx)}/hr · costo real ${fmtUSD(costs.hourlyCostUSD)}/hr`
                  : mode === "org"
                  ? `${fmtMXN(costs.monthlyWithMargin * fx)} · run rate anual ${fmtUSD(costs.annualWithMarginUSD)}`
                  : fmtMXN(costs.withMargin * fx)}
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(mode === "freelancer"
                  ? [
                      { label: "Costo mensual", value: costs.monthlyUSD, color: "var(--text-1)" },
                      { label: `Con margen ${margin}%`, value: costs.monthlyWithMargin, color: "var(--warning)" },
                      { label: "Costo por hora", value: costs.hourlyCostUSD, color: "var(--accent-alt)" },
                      { label: "Facturación anual", value: costs.annualWithMarginUSD, color: "var(--accent)" },
                    ]
                  : mode === "org"
                  ? [
                      { label: "Costo operativo mes", value: costs.monthlyUSD, color: "var(--text-1)" },
                      { label: `Con margen ${margin}%`, value: costs.monthlyWithMargin, color: "var(--warning)" },
                      { label: "Run rate anual base", value: costs.annualRunRateUSD, color: "var(--accent-alt)" },
                      { label: "Run rate con margen", value: costs.annualWithMarginUSD, color: "var(--accent)" },
                    ]
                  : [
                      { label: `Base ${months} meses`, value: costs.projectBase, color: "var(--text-1)" },
                      { label: `Con contingencia ${contingency}%`, value: costs.withCont, color: "var(--warning)" },
                      { label: "Utilidad bruta operativa", value: costs.grossProfit, color: "var(--accent)" },
                      { label: "Utilidad neta estimada", value: costs.estimatedNet, color: "var(--accent-alt)" },
                    ]
                ).map((metric) => (
                  <div key={metric.label} style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: 14, padding: 12 }}>
                    <div style={{ fontSize: 8, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{metric.label}</div>
                    <div style={{ fontSize: 16, color: metric.color, marginTop: 6 }}>{fmtUSD(metric.value)}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(metric.value * fx)}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <CatHeader label="Lectura financiera correcta" />
            <div style={{ padding: "14px 18px" }}>
              <SummaryMetric label="Utilidad bruta operativa" usd={costs.grossProfit} mxn={costs.grossProfit * fx} color="var(--accent)" note="Margen sobre costo + contingencia. No incluye impuestos ni comisiones." />
              <SummaryMetric label="Utilidad despues de comisiones" usd={costs.netAfterCommissions} mxn={costs.netAfterCommissions * fx} color="var(--accent-blue)" note="Resta pagos a vendedores o partners." />
              <SummaryMetric label="Carga fiscal estimada" usd={costs.estimatedTaxBurden} mxn={costs.estimatedTaxBurden * fx} color="var(--danger)" note="ISR + PTU + retenciones extranjero + IVA Netflix − IVA exportación recuperable." />
              <SummaryMetric label="Utilidad neta estimada" usd={costs.estimatedNet} mxn={costs.estimatedNet * fx} color="var(--accent-alt)" note="Despues de comisiones e impuestos estimados." />
            </div>
          </SectionCard>

          <SectionCard>
            <CatHeader label="Desglose carga fiscal del período" hint={`${(costs.extranjeroRetencionPeriodoUSD + costs.ivaImportDigitalPeriodoUSD - costs.ivaExportRecuperablePeriodoUSD) >= 0 ? "Aumenta" : "Reduce"} la carga`} />
            <div style={{ padding: "14px 18px" }}>
              <SummaryMetric label="ISR estimado" usd={costs.estimatedISR} mxn={costs.estimatedISR * fx} color="var(--danger)" />
              <SummaryMetric label="PTU estimada" usd={costs.estimatedPTU} mxn={costs.estimatedPTU * fx} color="var(--danger)" />
              <SummaryMetric label="Retención extranjero (período)" usd={costs.extranjeroRetencionPeriodoUSD} mxn={costs.extranjeroRetencionPeriodoUSD * fx} color="var(--warning)" note="Si pagas a OpenAI/AWS/Stripe Inc desde MX" />
              <SummaryMetric label="IVA Netflix tax (período)" usd={costs.ivaImportDigitalPeriodoUSD} mxn={costs.ivaImportDigitalPeriodoUSD * fx} color="var(--accent-blue)" note="Auto-acumulación 16% · si proveedor sin RFC MX" />
              <SummaryMetric label="IVA exportación recuperable (período)" usd={-costs.ivaExportRecuperablePeriodoUSD} mxn={-costs.ivaExportRecuperablePeriodoUSD * fx} color="var(--accent)" note="Recuperación SAT 6-9 meses · resta de carga fiscal" />
              <SummaryMetric label="Total carga fiscal" usd={costs.estimatedTaxBurden} mxn={costs.estimatedTaxBurden * fx} color="var(--danger)" />
            </div>
          </SectionCard>

          <SectionCard>
            <CatHeader label="Variables que siguen siendo aproximadas" />
            <div style={{ padding: "14px 18px", fontSize: 10, color: "var(--text-2)", lineHeight: 1.8 }}>
              <div>· IVA: se cobra al cliente pero no debe tratarse como ingreso propio.</div>
              <div>· PSP y pasarelas: si son variables, ya puedes modelarlas por tarifa x volumen en Stack & SaaS.</div>
              <div>· IA por uso: conviene cargar volumen mensual real para no subcotizar.</div>
              <div>· ISR / PTU son orientativos; la deducibilidad real cambia con tu operacion.</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
