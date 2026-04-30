export const fmtUSD = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.abs(value || 0) < 10 ? 2 : 0,
    maximumFractionDigits: Math.abs(value || 0) < 10 ? 3 : 0,
  }).format(value || 0);

export const fmtMXN = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

export const pct = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const money = (value) => Math.round(value * 100) / 100;

export function sanitizeNumericInput(raw, mode) {
  const stripped = raw.replace(/,/g, ".").replace(mode === "decimal" ? /[^\d.]/g : /\D/g, "");
  if (mode !== "decimal") return stripped;
  const [head, ...tail] = stripped.split(".");
  return tail.length > 0 ? `${head}.${tail.join("")}` : head;
}
