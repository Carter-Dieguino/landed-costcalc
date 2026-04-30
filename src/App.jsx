import { CalcProvider, useCalc } from "./lib/CalcContext.jsx";
import Header from "./components/Header.jsx";
import UsageHero from "./components/UsageHero.jsx";
import HumanTab from "./components/tabs/HumanTab.jsx";
import EquiposTab from "./components/tabs/EquiposTab.jsx";
import OficinaTab from "./components/tabs/OficinaTab.jsx";
import MovilidadTab from "./components/tabs/MovilidadTab.jsx";
import InfraTab from "./components/tabs/InfraTab.jsx";
import StackTab from "./components/tabs/StackTab.jsx";
import AITab from "./components/tabs/AITab.jsx";
import BeneficiosTab from "./components/tabs/BeneficiosTab.jsx";
import AdminTab from "./components/tabs/AdminTab.jsx";
import ComisionesTab from "./components/tabs/ComisionesTab.jsx";
import FiscalTab from "./components/tabs/FiscalTab.jsx";
import SummaryTab from "./components/tabs/SummaryTab.jsx";

const TAB_COMPONENTS = {
  human:    HumanTab,
  equipos:  EquiposTab,
  oficina:  OficinaTab,
  movil:    MovilidadTab,
  infra:    InfraTab,
  stack:    StackTab,
  ai:       AITab,
  benef:    BeneficiosTab,
  admin:    AdminTab,
  comision: ComisionesTab,
  fiscal:   FiscalTab,
  summary:  SummaryTab,
};

function ActiveTab() {
  const { tab } = useCalc();
  const Component = TAB_COMPONENTS[tab] || SummaryTab;
  return <Component />;
}

function Shell() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Header />
      <main style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "22px 20px 40px", display: "grid", gap: 18 }}>
        <UsageHero />
        <ActiveTab />
      </main>
      <footer style={{ borderTop: "1px solid var(--border)", padding: "12px 20px", textAlign: "center", fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em" }}>
        COSTCALC · Mercado mexicano · Referencias 2026
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CalcProvider>
      <Shell />
    </CalcProvider>
  );
}
