import { useCalc } from "../../lib/CalcContext.jsx";
import { ADMIN, ADMIN_CATS } from "../../data/admin.js";
import CatalogTab from "../CatalogTab.jsx";

export default function AdminTab() {
  const { adminOn, adminQty, toggleAdmin, setAdminQuantity, fx, costs } = useCalc();
  return (
    <CatalogTab
      catalog={ADMIN}
      cats={ADMIN_CATS}
      onMap={adminOn}
      qtyMap={adminQty}
      toggle={toggleAdmin}
      setQty={setAdminQuantity}
      fx={fx}
      totalPersonas={costs.totalPersonas}
      intro="Contabilidad, legal, banca, seguros corporativos · ítems variables (FX spread, Stripe %) requieren ajuste manual"
    />
  );
}
