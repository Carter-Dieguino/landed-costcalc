import { useCalc } from "../../lib/CalcContext.jsx";
import { OFICINA, OFICINA_CATS } from "../../data/oficina.js";
import CatalogTab from "../CatalogTab.jsx";

export default function OficinaTab() {
  const { oficinaOn, oficinaQty, toggleOficina, setOficinaQuantity, fx, costs } = useCalc();
  return (
    <CatalogTab
      catalog={OFICINA}
      cats={OFICINA_CATS}
      onMap={oficinaOn}
      qtyMap={oficinaQty}
      toggle={toggleOficina}
      setQty={setOficinaQuantity}
      fx={fx}
      totalPersonas={costs.totalPersonas}
      intro="Oficina, conectividad, móvil y VoIP · renta tradicional es $/m² (multiplica por m²/persona, ~6-9)"
    />
  );
}
