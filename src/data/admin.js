// Admin: contabilidad, legal, banca, seguros corporativos (mensual)
// Cifras Q1 2026, MX (principal) + USA (referencia).

export const ADMIN = [
  // ─── CONTABILIDAD MX ────────────────────────────────────────────────────────
  { id: "contador_basic",   label: "Despacho Contable (1-5 emp)",            cat: "Contabilidad",      mxn: 3000,  note: "PM RESICO/Gral, mensuales y nómina básica" },
  { id: "contador_mid",     label: "Despacho Contable (5-20 emp)",           cat: "Contabilidad",      mxn: 6500,  note: "Incluye IMSS/INFONAVIT, DIOT, contabilidad-e" },
  { id: "contador_large",   label: "Despacho Contable (20+ emp)",            cat: "Contabilidad",      mxn: 13000, note: "Variable según pólizas" },
  { id: "konta_digital",    label: "Konta.com / Fixat (PM digital)",         cat: "Contabilidad",      mxn: 2500,  note: "Alternativa fintech" },
  { id: "heru_pf",          label: "Heru (PF / RESICO)",                     cat: "Contabilidad",      mxn: 399,   note: "Solo personas físicas" },
  { id: "sw_contpaq",       label: "ContPaQ i / Aspel COI licencia",         cat: "Contabilidad",      mxn: 540,   note: "$6,500/año amortizado" },
  { id: "bind_erp",         label: "Bind ERP",                               cat: "Contabilidad",      mxn: 1490,  note: "ERP en la nube" },
  { id: "alegra",           label: "Alegra MX",                              cat: "Contabilidad",      mxn: 599,   note: "Plan PyME" },
  { id: "pac_facturapi",    label: "Facturapi (CFDI API)",                   cat: "Contabilidad",      mxn: 299,   note: "+ ~$1/timbre · paquete 1k: $1,500" },
  { id: "pac_sw",           label: "SW Sapien timbrado",                     cat: "Contabilidad",      mxn: 700,   note: "500 timbres/mes promedio" },
  { id: "pac_finkok",       label: "Finkok timbrado",                        cat: "Contabilidad",      mxn: 250,   note: "$0.65-1.20 por timbre" },
  { id: "auditoria_pyme",   label: "Auditoría externa anual (PyME)",         cat: "Contabilidad",      mxn: 10000, note: "$120k/año amortizado" },
  { id: "dictamen_fiscal",  label: "Dictamen fiscal (>122M ingresos)",       cat: "Contabilidad",      mxn: 25000, note: "$300k/año, solo si aplica" },
  { id: "precios_transf",   label: "Estudio Precios de Transferencia",       cat: "Contabilidad",      mxn: 7500,  note: "$90k/año si hay matriz/relacionadas" },

  // ─── LEGAL MX ───────────────────────────────────────────────────────────────
  { id: "iguala_legal",     label: "Iguala laboral / corporativo boutique",  cat: "Legal",             mxn: 9000,  note: "Despacho mediano $6-15k" },
  { id: "iguala_grande",    label: "Iguala bufete grande",                   cat: "Legal",             mxn: 35000, note: "$25-60k/mes" },
  { id: "marca_impi_amort", label: "Registro Marca IMPI (1 clase, amort)",   cat: "Legal",             mxn: 280,   note: "$2,813 oficial / 10 años" },
  { id: "despacho_ip",      label: "Honorarios despacho IP por marca",       cat: "Legal",             mxn: 700,   note: "$7k una vez / 10 años" },
  { id: "aviso_privacidad", label: "Aviso Privacidad LFPDPPP (amort)",       cat: "Legal",             mxn: 100,   note: "$5k una vez / 5 años" },
  { id: "nom_035",          label: "NOM-035 implementación",                 cat: "Legal",             mxn: 1250,  note: "Multas hasta $542k MXN" },
  { id: "nom_037",          label: "NOM-037 teletrabajo (programa)",         cat: "Legal",             mxn: 800,   note: "$10k una vez amortizado" },
  { id: "contrato_saas",    label: "Contrato MSA/SaaS por cliente",          cat: "Legal",             mxn: 2500,  note: "$25k uno cada 10 cierres" },
  { id: "tyc_web",          label: "T&C + Aviso Privacidad sitio web",       cat: "Legal",             mxn: 200,   note: "$10k una vez amortizado" },
  { id: "compliance_pld",   label: "Compliance PLD/KYC (si aplica)",         cat: "Legal",             mxn: 25000, note: "Solo actividad vulnerable / fintech" },
  { id: "registered_agent_us", label: "Registered Agent USA anual (amort)",  cat: "Legal",             usd: 12,    note: "$150/año post Stripe Atlas" },
  { id: "delaware_franchise", label: "Delaware Franchise Tax C-Corp (amort)",cat: "Legal",             usd: 38,    note: "$450/año típico startup" },

  // ─── BANCA Y FINANZAS ───────────────────────────────────────────────────────
  { id: "cta_bbva_pyme",    label: "BBVA Maestra Pyme Digital",              cat: "Banca",             mxn: 0,     note: "Sin manejo, SPEI gratis" },
  { id: "cta_santander",    label: "Santander PyME (manejo)",                cat: "Banca",             mxn: 520,   note: "El más caro entre tier-1" },
  { id: "cta_banorte",      label: "Banorte Enlace Negocios",                cat: "Banca",             mxn: 0,     note: "Sin manejo" },
  { id: "cta_hsbc",         label: "HSBC Empresarial",                       cat: "Banca",             mxn: 350,   note: "Saldo mín $20k" },
  { id: "cta_usd_intercam", label: "Cuenta USD MX (Intercam/Monex)",         cat: "Banca",             usd: 20,    note: "Manejo + spread ~1-2%" },
  { id: "wire_intl_out",    label: "Transfer USD saliente (banco MX)",       cat: "Banca",             usd: 35,    note: "Por wire" },
  { id: "mercury_us",       label: "Mercury (US, sin manejo)",               cat: "Banca",             usd: 0,     note: "FDIC $5M sweep, requiere LLC US" },
  { id: "wise_business",    label: "Wise Business",                          cat: "Banca",             usd: 0,     note: "Sin manejo, spread 0.41-0.6%" },
  { id: "spread_banco_pct", label: "FX spread bancario MX (~2% volumen)",    cat: "Banca",             usd: 0,     note: "1.5-3% sobre USD convertido — ajustar manual" },
  { id: "stripe_mx_pct",    label: "Stripe MX 3.6% + $3 (variable)",         cat: "Banca",             usd: 0,     note: "Ajustar según volumen real" },
  { id: "conekta_pct",      label: "Conekta 2.9% + $2.5 (variable)",         cat: "Banca",             usd: 0,     note: "Ajustar según volumen real" },
  { id: "factoring_xepelin",label: "Factoring Xepelin (1.5-3.5% mensual)",   cat: "Banca",             usd: 0,     note: "Sobre factura adelantada — ajustar" },
  { id: "konfio_credito",   label: "Konfío crédito PyME (CAT 28-33%)",       cat: "Banca",             usd: 0,     note: "Anual sobre saldo — ajustar" },

  // ─── SEGUROS CORPORATIVOS ───────────────────────────────────────────────────
  { id: "seguro_eo",        label: "RC Profesional / E&O tech",              cat: "Seguros",           mxn: 3000,  note: "$36k/año, suma $10M" },
  { id: "seguro_cyber",     label: "Cyber Insurance (ransomware/breach)",    cat: "Seguros",           mxn: 5000,  note: "$60k/año, suma $5-50M" },
  { id: "seguro_oficina",   label: "Contenido oficina + RC general",         cat: "Seguros",           mxn: 1500,  note: "$18k/año" },
  { id: "seguro_do",        label: "D&O (Directors & Officers)",             cat: "Seguros",           mxn: 5500,  note: "Crítico con inversionistas" },
  { id: "seguro_auto_flota",label: "Auto flotilla (por unidad)",             cat: "Seguros",           mxn: 2000,  note: "$24k/año cobertura amplia" },
  { id: "fianza_fiel_pct",  label: "Fianza fiel desempeño (1-3% afianzado)", cat: "Seguros",           mxn: 0,     note: "Para licitaciones gobierno" },
  { id: "eo_us_bundle",     label: "E&O + Cyber bundle US (Hiscox/Coalition)",cat: "Seguros",          usd: 130,   note: "Startup ~$130/mes" },

  // ─── SERVICIOS GENERALES ────────────────────────────────────────────────────
  { id: "mensajeria",       label: "Mensajería DHL/FedEx/Estafeta",          cat: "Servicios",         mxn: 1500,  note: "Promedio empresa pequeña" },
  { id: "impresora_paas",   label: "Renta multifuncional HP/Xerox",          cat: "Servicios",         mxn: 2200,  note: "Incluye toner y mantto" },
  { id: "insumos_emp",      label: "Insumos oficina por empleado",           cat: "Servicios",         mxn: 500,   note: "Papel, plumas, café básico" },
  { id: "asistente_va",     label: "Asistente Virtual MX (FT)",              cat: "Servicios",         mxn: 14000, note: "Junior tiempo completo" },
  { id: "deel_eor",         label: "Deel EOR (full)",                        cat: "Servicios",         usd: 599,   note: "Por empleado contratado" },
  { id: "deel_contractor",  label: "Deel Contractor",                        cat: "Servicios",         usd: 49,    note: "Por contractor" },
  { id: "remote_eor",       label: "Remote.com EOR",                         cat: "Servicios",         usd: 599,   note: "Mismo rango que Deel" },
  { id: "repse_amort",      label: "REPSE registro/renovación (amort)",      cat: "Servicios",         mxn: 700,   note: "$25k cada 3 años · obligatorio" },

  // ─── ESTABLECIMIENTO USA ────────────────────────────────────────────────────
  { id: "stripe_atlas_amort", label: "Stripe Atlas LLC/C-Corp (amort 5y)",   cat: "Establecimiento US",usd: 8,     note: "$500 una vez · incl. RA año 1" },
  { id: "clerky_amort",     label: "Clerky C-Corp DE (amort 5y)",            cat: "Establecimiento US",usd: 13,    note: "$799 + state fees" },
  { id: "pilot_bookkeep",   label: "Pilot bookkeeping",                      cat: "Establecimiento US",usd: 599,   note: "GAAP-ready" },
  { id: "bench_bookkeep",   label: "Bench bookkeeping",                      cat: "Establecimiento US",usd: 249,   note: "Más económico" },
  { id: "cpa_us_anual",     label: "CPA tax filing anual (amort)",           cat: "Establecimiento US",usd: 250,   note: "$3,000/año amortizado" },
];

export const ADMIN_CATS = [...new Set(ADMIN.map((item) => item.cat))];
