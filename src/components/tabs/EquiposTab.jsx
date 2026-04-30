import { useCalc } from "../../lib/CalcContext.jsx";
import { EQUIPOS, EQUIPOS_CATS } from "../../data/equipos.js";
import CatalogTab from "../CatalogTab.jsx";

export default function EquiposTab() {
  const { equiposOn, equiposQty, toggleEquipos, setEquiposQuantity, fx, costs } = useCalc();
  return (
    <CatalogTab
      catalog={EQUIPOS}
      cats={EQUIPOS_CATS}
      onMap={equiposOn}
      qtyMap={equiposQty}
      toggle={toggleEquipos}
      setQty={setEquiposQuantity}
      fx={fx}
      totalPersonas={costs.totalPersonas}
      intro="Hardware amortizado mensual · vida útil aplicada (laptops 48m, monitores 72m, sillas 144m)"
    />
  );
}
