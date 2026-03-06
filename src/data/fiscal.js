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
