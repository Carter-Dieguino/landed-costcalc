import { useCalc } from "../../lib/CalcContext.jsx";
import { BENEFICIOS, BENEFICIOS_CATS } from "../../data/beneficios.js";
import CatalogTab from "../CatalogTab.jsx";

export default function BeneficiosTab() {
  const { benefOn, benefQty, toggleBenef, setBenefQuantity, fx, costs } = useCalc();
  return (
    <CatalogTab
      catalog={BENEFICIOS}
      cats={BENEFICIOS_CATS}
      onMap={benefOn}
      qtyMap={benefQty}
      toggle={toggleBenef}
      setQty={setBenefQuantity}
      fx={fx}
      totalPersonas={costs.totalPersonas}
      intro="GMM, vales, perks, capacitación, reclutamiento · ítems PEPM se multiplican por personas activas"
    />
  );
}
