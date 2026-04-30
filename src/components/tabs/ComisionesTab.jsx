import { useCalc } from "../../lib/CalcContext.jsx";
import { fmtUSD, fmtMXN } from "../../lib/format.js";
import SectionCard from "../ui/SectionCard.jsx";
import CatHeader from "../ui/CatHeader.jsx";
import SummaryMetric from "../ui/SummaryMetric.jsx";
import NumericInput from "../ui/NumericInput.jsx";
import TextInput from "../ui/TextInput.jsx";
import SelectInput from "../ui/SelectInput.jsx";
import ActionButton from "../ui/ActionButton.jsx";

export default function ComisionesTab() {
  const { fx, costs, sellers, addSeller, removeSeller, updateSeller } = useCalc();

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 880 }}>
      <SectionCard>
        <CatHeader label="Personas con comision" />
        {sellers.map((seller) => {
          const base = seller.appliesToNet ? costs.withCont : costs.withMargin;
          const estimate = (base * seller.commPct) / 100;
          return (
            <div key={seller.id} style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1.2fr 1fr 100px 1.2fr 140px auto", gap: 12, alignItems: "end" }}>
              <div>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>NOMBRE</div>
                <TextInput value={seller.name} onChange={(v) => updateSeller(seller.id, "name", v)} placeholder="Ej. Carlos Reyes" style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>ROL</div>
                <TextInput value={seller.role} onChange={(v) => updateSeller(seller.id, "role", v)} placeholder="Vendedor / Partner" style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>%</div>
                <NumericInput value={seller.commPct} onChange={(v) => updateSeller(seller.id, "commPct", v)} min={0} max={80} mode="decimal" style={{ width: 88 }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.12em" }}>BASE</div>
                <SelectInput
                  value={seller.appliesToNet ? "net" : "gross"}
                  onChange={(v) => updateSeller(seller.id, "appliesToNet", v === "net")}
                  options={[
                    { value: "gross", label: "Precio final al cliente" },
                    { value: "net",   label: "Base + contingencia" },
                  ]}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--text-3)" }}>Estimado</div>
                <div style={{ fontSize: 14, color: "var(--accent-alt)" }}>{fmtUSD(estimate)}</div>
                <div style={{ fontSize: 10, color: "var(--text-3)" }}>{fmtMXN(estimate * fx)}</div>
              </div>
              {sellers.length > 1 ? <ActionButton label="Quitar" onClick={() => removeSeller(seller.id)} tone="subtle" /> : <div />}
            </div>
          );
        })}
        <div style={{ padding: "12px 16px" }}>
          <ActionButton label="Agregar vendedor / socio" onClick={addSeller} tone="subtle" />
        </div>
      </SectionCard>

      <SectionCard>
        <CatHeader label="Impacto" />
        <div style={{ padding: "14px 18px" }}>
          <SummaryMetric label="Precio al cliente antes de comisiones" usd={costs.withMargin} mxn={costs.withMargin * fx} color="var(--accent)" />
          <SummaryMetric label="Total comisiones" usd={costs.totalCommUSD} mxn={costs.totalCommUSD * fx} color="var(--danger)" />
          <SummaryMetric label="Utilidad tras comisiones" usd={costs.netAfterCommissions} mxn={costs.netAfterCommissions * fx} color="var(--accent-alt)" note="Aun sin ISR / PTU" />
        </div>
      </SectionCard>
    </div>
  );
}
