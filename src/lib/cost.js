import { money } from "./format.js";

export function getRoleMonthlyMXN(role, seniority) {
  switch (seniority) {
    case "min": return role.minMXN;
    case "max": return role.maxMXN;
    default:    return Math.round((role.minMXN + role.maxMXN) / 2);
  }
}

export function getStackVariableState(variableState, item) {
  return (
    variableState[item.id] || {
      mode: item.unit?.includes("usuario") ? "per_user" : "usage",
      rate: item.unit?.includes("gratis") ? 0 : 0.1,
      quantity: item.unit?.includes("usuario") ? 5 : 1000,
      label: item.unit?.includes("usuario") ? "usuarios" : "unidades",
    }
  );
}

export function getStackCost(item, stackQty, stackVariable) {
  if (item.usd > 0) {
    return money(item.usd * (stackQty[item.id] || 1));
  }
  const variable = getStackVariableState(stackVariable, item);
  if (variable.mode === "fixed") return money(variable.rate);
  return money(variable.rate * variable.quantity);
}

export function getAIDefaultUsage(item) {
  if (item.billing === "monthly") return { units: item.monthlyUSD || 0, tokensM: 0, outputTokensM: 0 };
  if (item.billing === "usage")   return { units: item.defaultUnits || 100, tokensM: 0, outputTokensM: 0 };
  return { units: 0, tokensM: 1, outputTokensM: 0.43 };
}

export function getAIUsageState(aiUsage, item) {
  const stored = aiUsage[item.id];
  if (!stored) return getAIDefaultUsage(item);
  if (item.billing === "tokens" && stored.outputTokensM === undefined) {
    return { ...stored, outputTokensM: (stored.tokensM || 0) * 0.43 };
  }
  return stored;
}

export function getAICost(item, aiUsage) {
  const usage = getAIUsageState(aiUsage, item);
  if (item.billing === "monthly") return money(item.monthlyUSD || usage.units || 0);
  if (item.billing === "usage")   return money((item.rateUSD || 0) * (usage.units || 0));
  const inputM = usage.tokensM || 0;
  const outputM = usage.outputTokensM || 0;
  return money(inputM * (item.inputPer1M || 0) + outputM * (item.outputPer1M || 0));
}

export function describeAIItem(item, fmtUSD) {
  if (item.billing === "monthly") {
    return `Escenario mensual ${fmtUSD(item.monthlyUSD || 0)}${item.note ? ` · ${item.note}` : ""}`;
  }
  if (item.billing === "usage") {
    return `${fmtUSD(item.rateUSD || 0)} por ${item.unitLabel}${item.note ? ` · ${item.note}` : ""}`;
  }
  return `input ${fmtUSD(item.inputPer1M || 0)}/1M · output ${fmtUSD(item.outputPer1M || 0)}/1M${item.note ? ` · ${item.note}` : ""}`;
}

export function getCatalogItemUSD(item, fx) {
  if (typeof item.usd === "number") return item.usd;
  if (typeof item.mxn === "number") return item.mxn / (fx || 1);
  return 0;
}

export function sumCatalog(catalog, onMap, qtyMap, fx, totalPersonas = 0) {
  let sumUSD = 0;
  catalog.forEach((item) => {
    if (!onMap[item.id]) return;
    const baseUSD = getCatalogItemUSD(item, fx);
    let qty = qtyMap[item.id];
    if (qty === undefined || qty === null) {
      qty = item.perPerson ? Math.max(1, totalPersonas) : 1;
    }
    sumUSD += baseUSD * qty;
  });
  return sumUSD;
}
