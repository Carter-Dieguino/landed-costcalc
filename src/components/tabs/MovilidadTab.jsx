import { useCalc } from "../../lib/CalcContext.jsx";
import { MOVILIDAD, MOVILIDAD_CATS } from "../../data/movilidad.js";
import CatalogTab from "../CatalogTab.jsx";

export default function MovilidadTab() {
  const { movilOn, movilQty, toggleMovil, setMovilQuantity, fx, costs } = useCalc();
  return (
    <CatalogTab
      catalog={MOVILIDAD}
      cats={MOVILIDAD_CATS}
      onMap={movilOn}
      qtyMap={movilQty}
      toggle={toggleMovil}
      setQty={setMovilQuantity}
      fx={fx}
      totalPersonas={costs.totalPersonas}
      intro="Combustible, autos, viajes y viáticos · topes SAT 2026: nacional $1,968/día · extranjero $3,148/día · gasolina $7,000 PEPM"
    />
  );
}
