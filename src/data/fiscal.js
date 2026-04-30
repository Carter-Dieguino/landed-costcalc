// ─── TRIBUTACIÓN MEXICANA (SAT 2025) ──────────────────────────────────────────

export const FISCAL_MX = {
  // ISR Personas Morales
  isrMoral: {
    tasa: 0.30,
    label: "ISR Persona Moral",
    desc: "30% sobre utilidad fiscal — Art. 9 LISR. Base: ingresos acumulables − deducciones autorizadas − PTU pagada.",
  },
  // ISR Personas Físicas (tabla art. 152 LISR) — tramo aplicable a ingresos altos
  isrFisicaTabla: [
    { limiteInf: 0,        limiteSup: 8952.49,   cuotaFija: 0,        porcentaje: 0.0192 },
    { limiteInf: 8952.50,  limiteSup: 75984.55,  cuotaFija: 171.88,   porcentaje: 0.0640 },
    { limiteInf: 75984.56, limiteSup: 133536.07, cuotaFija: 4461.94,  porcentaje: 0.1088 },
    { limiteInf: 133536.08,limiteSup: 155229.80, cuotaFija: 10723.55, porcentaje: 0.1600 },
    { limiteInf: 155229.81,limiteSup: 185852.57, cuotaFija: 14194.54, porcentaje: 0.1792 },
    { limiteInf: 185852.58,limiteSup: 374837.88, cuotaFija: 19682.13, porcentaje: 0.2136 },
    { limiteInf: 374837.89,limiteSup: 590795.99, cuotaFija: 60049.40, porcentaje: 0.2352 },
    { limiteInf: 590796.00,limiteSup: 1127926.84,cuotaFija: 110842.74,porcentaje: 0.30   },
    { limiteInf: 1127926.85,limiteSup: 1503902.46,cuotaFija: 271981.99,porcentaje: 0.32  },
    { limiteInf: 1503902.47,limiteSup: 4511707.37,cuotaFija: 392294.17,porcentaje: 0.34  },
    { limiteInf: 4511707.38,limiteSup: Infinity,  cuotaFija: 1414947.85,porcentaje: 0.35 },
  ],
  // RESICO (Régimen Simplificado de Confianza) — personas físicas
  resico: {
    label: "RESICO — Personas Físicas",
    desc: "Régimen simplificado de confianza. Hasta $3.5M ingresos anuales. Tasa ISR del 1% al 2.5% sobre ingresos cobrados.",
    tasaMin: 0.01,
    tasaMax: 0.025,
    limiteAnual: 3500000, // MXN
  },
  // RESICO Personas Morales
  resicoMoral: {
    label: "RESICO — Personas Morales",
    desc: "Aplica a PM con ingresos hasta $35M anuales. Tasa ISR 1% sobre ingresos del ejercicio.",
    tasa: 0.01,
    limiteAnual: 35000000,
  },
  // IVA
  iva: {
    tasa: 0.16,
    label: "IVA",
    desc: "16% sobre actos o actividades gravados. En servicios digitales/tech se traslada al cliente. Declaración mensual.",
  },
  // ISR retención honorarios
  retencionHonorarios: {
    tasa: 0.10,
    label: "Retención ISR Honorarios",
    desc: "10% retención cuando recibes pagos de personas morales por honorarios o servicios profesionales.",
  },
  // IVA retención (servicios)
  retencionIVA: {
    tasa: 0.106667, // 2/3 del 16%
    label: "Retención IVA (2/3)",
    desc: "Las PM retienen 2/3 del IVA de servicios que contratan a PF. Equivale a 10.67% del importe.",
  },
  // PTU
  ptu: {
    tasa: 0.10,
    label: "PTU (Participación de Utilidades)",
    desc: "10% de la utilidad fiscal distribuible entre empleados. Obligatorio para PM y PF con trabajadores. Límite: 3 meses salario.",
  },
  // IMSS cuotas patronales (resumen)
  imss: {
    label: "Cuotas IMSS Patronales",
    desc: "Suma de cuotas patronales: enf. y mat. ~7.0%, invalidez 1.75%, RT ~1.5–5%, guarderías 1%, retiro 2%, cesantía 3.15%, infonavit 5%. Total estimado: ~26–30% del SBC.",
    factorEstimado: 0.28,
  },
  // Facturas CFDI
  cfdi: {
    label: "CFDI 4.0 — Facturación",
    desc: "Obligatorio para ingresos. Costo de timbre: $0–5 MXN por factura vía PAC. APIs disponibles: Facturapi, SW SAPien, Finkok.",
  },
};

// ─── REGÍMENES FISCALES COMUNES PARA TECH STARTUPS ──────────────────────────

export const REGIMENES = [
  {
    id: "pm_general",
    label: "Persona Moral — Régimen General",
    perfil: "SA de CV / SAS · ISR 30% · IVA 16% · PTU 10%",
    ventajas: "Facturación empresarial, socios pueden repartir dividendos, acceso a crédito.",
    consideraciones: "Contabilidad electrónica obligatoria, DIOT mensual, PTU anual.",
    isrEfectivo: 0.30,
  },
  {
    id: "resico_moral",
    label: "Persona Moral — RESICO",
    perfil: "SA/SAS con ingresos < $35M anuales · ISR 1% sobre ingresos",
    ventajas: "ISR drásticamente reducido. Sin PTU (ya incluida). Contabilidad simplificada.",
    consideraciones: "Sin deducción de gastos para ISR. Límite de ingresos anual.",
    isrEfectivo: 0.01,
  },
  {
    id: "pf_profesional",
    label: "Persona Física — Actividad Empresarial / Honorarios",
    perfil: "Freelance o consultor · ISR tabla progresiva hasta 35% · IVA 16%",
    ventajas: "Estructura simple. Deducciones de gastos permitidas.",
    consideraciones: "ISR alto en tramos altos. Retención del 10% ISR + 10.67% IVA por clientes PM.",
    isrEfectivo: 0.30, // promedio tramos altos
  },
  {
    id: "resico_fisica",
    label: "Persona Física — RESICO",
    perfil: "Ingresos < $3.5M anuales · ISR 1%–2.5% sobre cobrado",
    ventajas: "Tasa ISR muy baja. Sin declaración de deducciones. Cálculo mensual sencillo.",
    consideraciones: "No aplica si tienes socios/empleados con honorarios altos.",
    isrEfectivo: 0.025,
  },
];

// Función: calcular ISR persona física anual (tabla art. 152)
export function calcISRFisicaAnual(ingresoAnualMXN, fiscal = FISCAL_MX) {
  const tabla = fiscal.isrFisicaTabla;
  for (const tramo of tabla) {
    if (ingresoAnualMXN >= tramo.limiteInf && ingresoAnualMXN <= tramo.limiteSup) {
      const excedente = ingresoAnualMXN - tramo.limiteInf;
      return tramo.cuotaFija + excedente * tramo.porcentaje;
    }
  }
  return 0;
}

// ─── ISN POR ESTADO (Impuesto Sobre Nómina) — Tasas 2026 ──────────────────────
// Gasto patronal sobre nómina total. Algunos estados tuvieron alza en 2026
// (CDMX, NL, Chihuahua confirmado por alertas Coparmex). Verificar anualmente.
export const ISN_ESTADOS = [
  { id: "cdmx",      label: "CDMX",                tasa: 0.040, note: "Subió de 3% a 4% en 2026" },
  { id: "edomex",    label: "Estado de México",    tasa: 0.030, note: "" },
  { id: "jal",       label: "Jalisco",             tasa: 0.030, note: "5% si pagos asimilados" },
  { id: "nl",        label: "Nuevo León",          tasa: 0.040, note: "Subió en 2026" },
  { id: "pue",       label: "Puebla",              tasa: 0.030, note: "" },
  { id: "qro",       label: "Querétaro",           tasa: 0.030, note: "Subsidio 50% para empresas nuevas 2 años" },
  { id: "yuc",       label: "Yucatán",             tasa: 0.030, note: "Subsidio 100% año 1 sector tech" },
  { id: "qroo",      label: "Quintana Roo",        tasa: 0.030, note: "" },
  { id: "bc",        label: "Baja California",     tasa: 0.018, note: "Una de las más bajas; verificar fuente oficial" },
  { id: "bcs",       label: "Baja California Sur", tasa: 0.025, note: "" },
  { id: "son",       label: "Sonora",              tasa: 0.020, note: "" },
  { id: "chih",      label: "Chihuahua",           tasa: 0.030, note: "Subsidio para programas IMMEX/maquila" },
  { id: "coah",      label: "Coahuila",            tasa: 0.030, note: "" },
  { id: "tamps",     label: "Tamaulipas",          tasa: 0.030, note: "" },
  { id: "ver",       label: "Veracruz",            tasa: 0.030, note: "+ adicional UV efectivo 3.06%" },
  { id: "gto",       label: "Guanajuato",          tasa: 0.030, note: "Estímulos en parques industriales" },
  { id: "ags",       label: "Aguascalientes",      tasa: 0.020, note: "" },
  { id: "slp",       label: "San Luis Potosí",     tasa: 0.025, note: "+ adic. educación efectivo 2.63%" },
  { id: "sin",       label: "Sinaloa",             tasa: 0.024, note: "" },
  { id: "mich",      label: "Michoacán",           tasa: 0.030, note: "" },
  { id: "gro",       label: "Guerrero",            tasa: 0.020, note: "" },
  { id: "oax",       label: "Oaxaca",              tasa: 0.030, note: "" },
  { id: "chis",      label: "Chiapas",             tasa: 0.020, note: "" },
  { id: "tab",       label: "Tabasco",             tasa: 0.030, note: "" },
  { id: "camp",      label: "Campeche",            tasa: 0.030, note: "" },
  { id: "hgo",       label: "Hidalgo",             tasa: 0.030, note: "+ 5% adicional efectivo 3.15%" },
  { id: "tlx",       label: "Tlaxcala",            tasa: 0.030, note: "" },
  { id: "mor",       label: "Morelos",             tasa: 0.030, note: "+ 25% UAEM efectivo 3.75%" },
  { id: "nay",       label: "Nayarit",             tasa: 0.030, note: "" },
  { id: "col",       label: "Colima",              tasa: 0.020, note: "" },
  { id: "dgo",       label: "Durango",             tasa: 0.030, note: "" },
  { id: "zac",       label: "Zacatecas",           tasa: 0.030, note: "+ 35% UAZ efectivo 4.05% — el más alto" },
];

// ─── CARGA SOCIAL MX 2026 — Desglose por componente ───────────────────────────
// Reemplaza el factor genérico de 30%. Aplica sobre nómina bruta.
// Cifras vigentes 2026 — verificar año a año (CEAV escalonada hasta 2030).
export const CARGA_SOCIAL_MX = [
  { id: "imss",        label: "IMSS patronal completo (Clase I tech)", pct: 0.182, note: "E&M, IV, RT, guarderías, retiro, CEAV 5.15% (escalonada hasta 11.875% en 2030)" },
  { id: "infonavit",   label: "INFONAVIT 5%",                          pct: 0.054, note: "5% sobre SBC" },
  { id: "aguinaldo",   label: "Aguinaldo 15 días (mínimo legal)",      pct: 0.042, note: "Costumbre tech: 30 días = 8.33%" },
  { id: "primavac",    label: "Prima vacacional 25%",                  pct: 0.008, note: "12 días año 1 post reforma 2023" },
  { id: "ptu",         label: "PTU prorrateada (estimada)",            pct: 0.042, note: "10% utilidad, tope 3 meses; estimado equiv. mensual" },
];

export function getCargaSocialFactor({ stateId = "cdmx", includePTU = true, aguinaldo30Dias = false } = {}) {
  const isn = ISN_ESTADOS.find((s) => s.id === stateId)?.tasa || 0.03;
  let factor = 0;
  CARGA_SOCIAL_MX.forEach((item) => {
    if (item.id === "ptu" && !includePTU) return;
    if (item.id === "aguinaldo" && aguinaldo30Dias) {
      factor += 0.0833; // 30 días en lugar de 15
    } else {
      factor += item.pct;
    }
  });
  return factor + isn;
}

// ─── NOM-037 (Teletrabajo) — Subsidio mensual obligatorio si >40% remoto ──────
// STPS NOM-037-STPS-2023, vigente desde dic-2023. Cubre internet + luz + equipo.
export const NOM_037 = {
  label: "Subsidio Home Office NOM-037",
  defaultMXN: 1500,
  rangeMXN: [800, 2500],
  desc: "Obligatorio si >40% jornada remota. Cubre proporción de internet, luz y equipo.",
};

// ─── UMA y referencias 2026 ───────────────────────────────────────────────────
export const UMA_2026 = {
  diaria: 117.31,
  mensual: 3566.22,
  anual: 42794.64,
  topeSBC25UMA: 87982.50, // tope IMSS 25 UMA mensual
};

// Tope vales de despensa exento ISR/IMSS = 40% UMA mensual
export const VALES_DESPENSA_TOPE_EXENTO = UMA_2026.mensual * 0.40;

// ─── RETENCIONES A RESIDENTES EN EL EXTRANJERO (LISR Título V) ────────────────
// Cuando una empresa MX paga a entidad extranjera por software, regalías,
// servicios profesionales, etc. La columna "tratadoUSA" aplica si el proveedor
// presenta forma 6166 IRS de residencia fiscal y aplica el tratado MX-USA.
export const RETENCIONES_EXTRANJERO = [
  { id: "regalia_software",  label: "Regalía / uso de software",         general: 0.25, tratadoUSA: 0.10, note: "Aplica a OpenAI, Anthropic, AWS, GitHub si se considera software" },
  { id: "asistencia_tecnica",label: "Asistencia técnica",                general: 0.25, tratadoUSA: 0.10, note: "Consultoría especializada extranjera" },
  { id: "servicios_prof",    label: "Servicios profesionales",           general: 0.25, tratadoUSA: 0.00, note: "0% si proveedor permanece <183 días en MX" },
  { id: "interes_banco",     label: "Intereses banco extranjero",        general: 0.10, tratadoUSA: 0.049, note: "4.9% a bancos registrados" },
  { id: "dividendo_pf",      label: "Dividendos a PF residente",         general: 0.10, tratadoUSA: 0.10, note: "Adicional al ISR corporativo" },
  { id: "arrendamiento_mob", label: "Arrendamiento bienes muebles",      general: 0.25, tratadoUSA: 0.10, note: "Equipo, vehículos rentados a extranjero" },
  { id: "refipre",           label: "Pago a paraíso fiscal (REFIPRE)",   general: 0.40, tratadoUSA: 0.40, note: "Sin acceso a tratado · investigar antes de pagar" },
];

// IVA sobre importación de servicios digitales (Reforma 2020 “Netflix tax”)
// Si el proveedor extranjero NO está inscrito en RFC MX, la empresa MX debe
// auto-acumular 16% de IVA al gasto y enterarlo. Acreditable normal.
export const IVA_IMPORT_DIGITAL = {
  tasa: 0.16,
  label: "IVA importación servicios digitales",
  desc: "Auto-acumulación 16% si proveedor extranjero no está inscrito en RFC MX (LIVA art. 18-D).",
};

// IVA tasa 0% por exportación de servicios (LIVA art. 29-IV)
// Servicios prestados a residente en extranjero, aprovechados allá, cobrados USD.
// Permite acreditar IVA pagado en MX y pedir devolución (típico 6-9 meses).
export const IVA_EXPORTACION = {
  tasa: 0.00,
  label: "IVA tasa 0% exportación",
  desc: "Aplicable si facturas USD a empresa extranjera con servicios aprovechados fuera de México. Permite devolución de IVA pagado.",
};

// ─── EEUU PAYROLL FEDERAL 2026 ────────────────────────────────────────────────
// SSA wage base 2026 confirmado en $176,100 (verificar al cierre del año).
export const US_FEDERAL_2026 = {
  ssEmployer: { tasa: 0.062, wageBaseUSD: 176100, label: "Social Security patrón" },
  ssEmployee: { tasa: 0.062, wageBaseUSD: 176100, label: "Social Security empleado" },
  medicare:   { tasa: 0.0145, label: "Medicare (sin tope)" },
  medicareAddOver200k: { tasa: 0.009, threshold: 200000, label: "Additional Medicare > $200k" },
  futa:       { tasa: 0.006, wageBaseUSD: 7000, label: "FUTA efectiva (con crédito 5.4%)" },
  cCorp:      { tasa: 0.21, label: "Federal Corporate Income (C-Corp)" },
  selfEmployment: { tasa: 0.153, label: "Self-Employment Tax" },
};

// ─── EEUU ESTATAL — clave (2026) ──────────────────────────────────────────────
export const US_ESTATAL = [
  { id: "us_ca",  label: "California",  incomePF: { tasa: 0.133, note: "Hasta 13.3% progresivo" }, corp: { tasa: 0.0884, note: "C-Corp + $800 mín franchise" }, sui: { tasa: 0.034, wageBaseUSD: 7000, note: "Nuevos empleadores 3.4%" }, otros: ["SDI 1.2% sin tope desde 2024", "ETT 0.1%"] },
  { id: "us_tx",  label: "Texas",       incomePF: { tasa: 0,     note: "0% income tax" },           corp: { tasa: 0.0075, note: "Franchise 0.375-0.75% sobre margen" }, sui: { tasa: 0.027, wageBaseUSD: 9000 },  otros: ["SaaS gravado al 80% (rate efectivo ~5%)"] },
  { id: "us_ny",  label: "New York",    incomePF: { tasa: 0.109, note: "+ NYC city 3.876%" },       corp: { tasa: 0.0725, note: "C-Corp" }, sui: { tasa: 0.04, wageBaseUSD: 13000 },  otros: ["MCTMT 0.34% NYC", "Paid Family Leave"] },
  { id: "us_fl",  label: "Florida",     incomePF: { tasa: 0,     note: "0% income tax" },           corp: { tasa: 0.055, note: "C-Corp" }, sui: { tasa: 0.027, wageBaseUSD: 7000 },  otros: ["Reemployment tax"] },
  { id: "us_de",  label: "Delaware",    incomePF: { tasa: 0.066, note: "Hasta 6.6%" },              corp: { tasa: 0.087, note: "C-Corp + Franchise $175-$250k" }, sui: { tasa: 0.018, wageBaseUSD: 12500 }, otros: ["Gross Receipts 0.0945-0.7468%"] },
];

// Multas SAT comunes (rangos 2026)
export const MULTAS_SAT_COMUNES = [
  { id: "diot",         label: "No presentar DIOT mensual",          minMXN: 66300,  maxMXN: 132610, note: "Acumula cada mes" },
  { id: "cancel_cfdi",  label: "Cancelación CFDI sin motivo correcto", minMXN: 19700,  maxMXN: 112650, note: "Motivos 01-04 obligatorios desde 2022" },
  { id: "anual_pm",     label: "No declaración anual PM",             minMXN: 19350,  maxMXN: 38700,  note: "" },
  { id: "buzon",        label: "Buzón Tributario no actualizado",     minMXN: 4580,   maxMXN: 13740,  note: "Notificaciones se vuelven definitivas en 30d" },
  { id: "contab_e",     label: "Contabilidad electrónica no enviada", minMXN: 6070,   maxMXN: 30440,  note: "Mensual" },
];
