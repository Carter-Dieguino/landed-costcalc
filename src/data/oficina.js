// Oficina, conectividad, telecom - costos mensuales (Q1 2026)
// MXN cuando es local; USD cuando aplica internacional. Convertir con FX.
// Para renta tradicional el costo es por m² × m²/persona (calculadora UI).

export const OFICINA = [
  // ─── COWORKING (mensual por persona) ────────────────────────────────────────
  { id: "wework_hot",       label: "WeWork CDMX hot desk",                  cat: "Coworking",          mxn: 5500, note: "Por persona · acceso variable" },
  { id: "wework_dedicated", label: "WeWork CDMX dedicated desk",            cat: "Coworking",          mxn: 8500, note: "Escritorio fijo" },
  { id: "wework_priv1p",    label: "WeWork CDMX oficina privada 1p",        cat: "Coworking",          mxn: 13500,note: "Reforma / Polanco" },
  { id: "wework_all_access",label: "WeWork All Access global",              cat: "Coworking",          mxn: 5800, note: "Acceso global ($329 USD)" },
  { id: "ios_cdmx",         label: "IOS Offices CDMX dedicated",            cat: "Coworking",          mxn: 7500, note: "19 ubicaciones CDMX" },
  { id: "ios_gdl_mty",      label: "IOS Offices GDL/MTY dedicated",         cat: "Coworking",          mxn: 6500, note: "30% más barato que CDMX" },
  { id: "public_cdmx",      label: "Público / Cowork CDMX Roma",            cat: "Coworking",          mxn: 5500, note: "Boutique tech" },
  { id: "selina",           label: "Selina coworking (live/work)",          cat: "Coworking",          mxn: 4500, note: "Híbrido nómada" },
  { id: "wework_us_priv",   label: "WeWork US private office 1p",           cat: "Coworking",          usd: 1000, note: "Promedio NYC/SF" },

  // ─── RENTA TRADICIONAL ($/m²/mes — multiplica por m²/persona, típico 6-9) ───
  { id: "rent_polanco",     label: "Renta Polanco $/m²/mes",                cat: "Renta tradicional",  mxn: 494,  note: "$28 USD/m² promedio" },
  { id: "rent_reforma",     label: "Renta Reforma/Juárez $/m²/mes",         cat: "Renta tradicional",  mxn: 515,  note: "Hasta $1,500 en Masaryk" },
  { id: "rent_roma",        label: "Renta Roma/Condesa $/m²/mes",           cat: "Renta tradicional",  mxn: 515,  note: "Techos históricos 2026" },
  { id: "rent_santafe",     label: "Renta Santa Fe $/m²/mes",               cat: "Renta tradicional",  mxn: 498,  note: "Corporativo + parking extra" },
  { id: "rent_centro",      label: "Renta Centro CDMX $/m²/mes",            cat: "Renta tradicional",  mxn: 300,  note: "Más barato, menos demanda tech" },
  { id: "rent_gdl_prov",    label: "Renta GDL Providencia $/m²/mes",        cat: "Renta tradicional",  mxn: 400,  note: "+15% mantenimiento" },
  { id: "rent_gdl_andares", label: "Renta GDL Andares $/m²/mes",            cat: "Renta tradicional",  mxn: 450,  note: "Premium tapatío" },
  { id: "rent_mty_sp",      label: "Renta MTY San Pedro $/m²/mes",          cat: "Renta tradicional",  mxn: 525,  note: "Comparable a Polanco" },
  { id: "rent_us_sf",       label: "Renta SF $/m²/mes",                     cat: "Renta tradicional",  usd: 696,  note: "$62-90/sqft/año" },
  { id: "rent_us_nyc",      label: "Renta NYC Midtown $/m²/mes",            cat: "Renta tradicional",  usd: 750,  note: "$80-86/sqft/año" },
  { id: "rent_us_aus",      label: "Renta Austin $/m²/mes",                 cat: "Renta tradicional",  usd: 410,  note: "$46/sqft/año" },
  { id: "rent_us_mia",      label: "Renta Miami $/m²/mes",                  cat: "Renta tradicional",  usd: 500,  note: "$55/sqft/año" },

  // ─── SERVICIOS DE OFICINA (oficina ~80 m²) ──────────────────────────────────
  { id: "cfe_gdmth",        label: "CFE GDMTH luz oficina ~80m²",           cat: "Servicios oficina",  mxn: 6500, note: "Punta vs base 3x · operar fuera de pico baja 25-40%" },
  { id: "agua_sacmex",      label: "Agua SACMEX oficina",                   cat: "Servicios oficina",  mxn: 500,  note: "Mediana" },
  { id: "mantto_condominio",label: "Cuotas condominio (mantto)",            cat: "Servicios oficina",  mxn: 6500, note: "15-20% de la renta" },
  { id: "limpieza_3sem",    label: "Limpieza outsourcing 3x/sem",           cat: "Servicios oficina",  mxn: 6000, note: "REPSE deducible" },
  { id: "vigilancia",       label: "Vigilancia privada extra",              cat: "Servicios oficina",  mxn: 11500,note: "Si no incluye condominio" },
  { id: "predial_mes",      label: "Predial mensualizado (oficina propia)", cat: "Servicios oficina",  mxn: 2000, note: "Descuento 8% en enero" },
  { id: "snacks_cafe",      label: "Café/snacks/agua por persona",          cat: "Servicios oficina",  mxn: 450,  note: "Por colaborador" },
  { id: "mobiliario_amort", label: "Mobiliario inicial amortizado",         cat: "Servicios oficina",  mxn: 500,  note: "Capex $30k/persona, 5y" },
  { id: "estacionamiento",  label: "Estacionamiento mensual zonas tech",    cat: "Servicios oficina",  mxn: 5000, note: "Polanco / Roma / Santa Fe" },

  // ─── INTERNET EMPRESARIAL (mensual) ─────────────────────────────────────────
  { id: "tp_emp_200",       label: "Totalplay Empresas 200M sim + 2L",      cat: "Internet",           mxn: 1049, note: "Simétrico, voz incluida" },
  { id: "tp_emp_500",       label: "Totalplay Empresas 500M sim + 2L",      cat: "Internet",           mxn: 1499, note: "Simétrico premium" },
  { id: "tp_emp_1g",        label: "Totalplay Empresas 1G sim + 2L",        cat: "Internet",           mxn: 1899, note: "Top PyME simétrico" },
  { id: "telmex_neg_500",   label: "Telmex Infinitum Negocios 500M",        cat: "Internet",           mxn: 999,  note: "Asimétrico" },
  { id: "telmex_neg_1g",    label: "Telmex Infinitum Negocios 1G",          cat: "Internet",           mxn: 2289, note: "Asimétrico subida ~50M" },
  { id: "izzi_emp_500",     label: "Izzi Empresas 500M",                    cat: "Internet",           mxn: 799,  note: "Cable HFC asimétrico" },
  { id: "mega_emp_1g",      label: "Megacable Empresas 1G",                 cat: "Internet",           mxn: 1099, note: "HFC asimétrico" },
  { id: "home_office_500",  label: "Internet residencial 500M (home office)",cat: "Internet",          mxn: 599,  note: "Reembolso home office" },
  { id: "att_us_fiber_1g",  label: "AT&T Business Fiber 1G",                cat: "Internet",           usd: 140,  note: "USA referencia" },
  { id: "comcast_us_1g",    label: "Comcast Business 1G",                   cat: "Internet",           usd: 600,  note: "USA $400-800" },

  // ─── ENLACE DEDICADO ────────────────────────────────────────────────────────
  { id: "metro_100_ded",    label: "MetroCarrier 100M dedicado simétrico",  cat: "Enlace dedicado",    mxn: 10000,note: "SLA 99.9% empresarial" },
  { id: "metro_500_ded",    label: "MetroCarrier 500M dedicado",            cat: "Enlace dedicado",    mxn: 25000,note: "Cotización fibra dedicada" },
  { id: "metro_1g_ded",     label: "MetroCarrier 1G dedicado",              cat: "Enlace dedicado",    mxn: 50000,note: "Enterprise" },
  { id: "marcatel_micro",   label: "Marcatel microondas 100M",              cat: "Enlace dedicado",    mxn: 10788,note: "Backup zonas sin fibra" },
  { id: "lte_failover",     label: "LTE failover 4G/M2M",                   cat: "Enlace dedicado",    mxn: 600,  note: "Redundancia barata" },

  // ─── MÓVIL CORPORATIVO (línea/mes) ──────────────────────────────────────────
  { id: "telcel_max_neg",   label: "Telcel Plan Negocio Max 4G",            cat: "Móvil corp",         mxn: 799,  note: "Por línea, ilim. nac+US/CA" },
  { id: "att_mx_neg",       label: "AT&T MX Negocios Ilimitado",            cat: "Móvil corp",         mxn: 649,  note: "Por línea" },
  { id: "movistar_emp",     label: "Movistar Empresas 350",                 cat: "Móvil corp",         mxn: 449,  note: "Económico" },
  { id: "verizon_us_pro",   label: "Verizon Business Unlimited Pro",        cat: "Móvil corp",         usd: 55,   note: "USA referencia" },
  { id: "tmobile_us_ult",   label: "T-Mobile Business Ultimate+",           cat: "Móvil corp",         usd: 50,   note: "USA referencia" },

  // ─── VOIP / TELEFONÍA ───────────────────────────────────────────────────────
  { id: "ringcentral_core", label: "RingCentral Core (por usuario)",        cat: "VoIP",               usd: 20,   note: "Plan base" },
  { id: "ringcentral_adv",  label: "RingCentral Advanced (por usuario)",    cat: "VoIP",               usd: 25,   note: "" },
  { id: "zoom_phone",       label: "Zoom Phone Pro (por usuario)",          cat: "VoIP",               usd: 10,   note: "Más barato del mercado" },
  { id: "8x8_x2",           label: "8x8 X2 (por usuario)",                  cat: "VoIP",               usd: 24,   note: "" },
  { id: "sip_trunk",        label: "Trunk SIP Marcatel/Bestel (canal)",     cat: "VoIP",               mxn: 350,  note: "Por canal" },
  { id: "did_800",          label: "DID número 800",                        cat: "VoIP",               mxn: 400,  note: "+$0.30/min entrante" },
];

export const OFICINA_CATS = [...new Set(OFICINA.map((item) => item.cat))];
