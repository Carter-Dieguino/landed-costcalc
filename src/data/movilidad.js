// Movilidad, energía, viajes y viáticos - costos mensuales (Q1 2026)
// MXN/USD según corresponda. Ítems perPerson se multiplican por personas activas.
// Topes SAT actualizados 2026: viáticos nacional $1,968/día, extranjero $3,148/día,
// gasolina deducible vía monedero electrónico hasta $7,000 MXN/empleado/mes.

export const MOVILIDAD = [
  // ─── ENERGÍA Y COMBUSTIBLE ──────────────────────────────────────────────────
  { id: "vales_gasolina_tope", label: "Vales gasolina (tope SAT exento)",      cat: "Combustible",   mxn: 7000,  note: "Tope deducible vía monedero autorizado · ajusta consumo real", perPerson: true },
  { id: "vales_gasolina_med",  label: "Vales gasolina uso medio",              cat: "Combustible",   mxn: 3500,  note: "Comerciales / sales", perPerson: true },
  { id: "vales_gasolina_bajo", label: "Vales gasolina uso bajo",               cat: "Combustible",   mxn: 1500,  note: "Trayectos ocasionales", perPerson: true },
  { id: "casetas_promedio",    label: "Casetas mensuales promedio",            cat: "Combustible",   mxn: 1200,  note: "Sales/PM con rutas frecuentes" },
  { id: "tag_iave_telepeaje",  label: "TAG IAVE / Telepeaje (manejo)",         cat: "Combustible",   mxn: 50,    note: "Cuota servicio mensual" },
  { id: "energia_residencial", label: "Luz residencial home office (CFE)",     cat: "Combustible",   mxn: 600,   note: "Consumo extra por equipo y AC", perPerson: true },
  { id: "gas_lp_oficina",      label: "Gas LP oficina (cocina)",               cat: "Combustible",   mxn: 350,   note: "Si la oficina cocina" },
  { id: "carga_ev_oficina",    label: "Carga vehículo EV oficina",             cat: "Combustible",   mxn: 1500,  note: "Si das estación de carga (CFE punta vs base)" },

  // ─── AUTOS CORPORATIVOS ─────────────────────────────────────────────────────
  { id: "auto_leasing_compact", label: "Leasing operativo auto compacto",       cat: "Autos corp",    mxn: 9000,  note: "Element/ALD/Arval · sedán entry" },
  { id: "auto_leasing_suv",     label: "Leasing operativo SUV mediano",         cat: "Autos corp",    mxn: 13500, note: "Tucson/CR-V/Equinox" },
  { id: "auto_leasing_premium", label: "Leasing operativo premium",             cat: "Autos corp",    mxn: 22000, note: "BMW/Audi/Mercedes ejecutivo" },
  { id: "auto_leasing_pickup",  label: "Leasing pickup operativa",              cat: "Autos corp",    mxn: 14500, note: "Hilux/Ranger flotilla" },
  { id: "seguro_auto_amplia",   label: "Seguro auto cobertura amplia",          cat: "Autos corp",    mxn: 2000,  note: "Por unidad · $24k/año" },
  { id: "tenencia_amort",       label: "Tenencia anual amortizada",             cat: "Autos corp",    mxn: 250,   note: "$3k/año variando estado" },
  { id: "verificacion_cdmx",    label: "Verificación CDMX/EdoMex (semestral)",  cat: "Autos corp",    mxn: 70,    note: "$420/sem amort" },
  { id: "mantto_auto",          label: "Mantenimiento preventivo auto",         cat: "Autos corp",    mxn: 1200,  note: "Servicios + llantas amort" },
  { id: "reembolso_km_propio",  label: "Reembolso auto propio ($/km × 1500km)", cat: "Autos corp",    mxn: 4500,  note: "$3/km típico tope SAT", perPerson: true },

  // ─── MOVILIDAD URBANA ───────────────────────────────────────────────────────
  { id: "uber_business_dev",   label: "Uber for Business (dev / PM)",          cat: "Movilidad urbana",mxn: 2500,  note: "~12 viajes/mes promedio CDMX", perPerson: true },
  { id: "uber_business_sales", label: "Uber for Business (sales / BD)",        cat: "Movilidad urbana",mxn: 6500,  note: "Rutas frecuentes a clientes", perPerson: true },
  { id: "didi_business",       label: "DiDi for Business",                     cat: "Movilidad urbana",mxn: 2200,  note: "Alternativa más barata", perPerson: true },
  { id: "metro_metrobus",      label: "Subsidio transporte público",           cat: "Movilidad urbana",mxn: 800,   note: "Metro / Metrobús / MIO", perPerson: true },
  { id: "estacionamiento_mes", label: "Estacionamiento mensual zona tech",     cat: "Movilidad urbana",mxn: 5000,  note: "Polanco/Roma/Santa Fe" },
  { id: "estacionamiento_cliente", label: "Estacionamiento por visita cliente",cat: "Movilidad urbana",mxn: 600,   note: "Mall + corporativo (4-6 visitas/mes)" },
  { id: "renta_auto_dia",      label: "Renta auto compacto día",               cat: "Movilidad urbana",mxn: 1100,  note: "Sixt/Hertz business · ajustar días/mes" },

  // ─── VIAJES NACIONALES ──────────────────────────────────────────────────────
  { id: "vuelo_mex_gdl",       label: "Vuelo MEX-GDL ida promedio",            cat: "Viajes nacional", mxn: 2100,  note: "Volaris/Aeroméxico/Viva" },
  { id: "vuelo_mex_mty",       label: "Vuelo MEX-MTY ida promedio",            cat: "Viajes nacional", mxn: 2400,  note: "" },
  { id: "vuelo_mex_cun",       label: "Vuelo MEX-CUN ida promedio",            cat: "Viajes nacional", mxn: 3200,  note: "" },
  { id: "vuelo_mex_tij",       label: "Vuelo MEX-TIJ ida promedio",            cat: "Viajes nacional", mxn: 3000,  note: "" },
  { id: "hotel_business_mx",   label: "Hotel business CDMX/GDL/MTY noche",     cat: "Viajes nacional", mxn: 2500,  note: "Hampton/AC/ibis Styles" },
  { id: "hotel_premium_mx",    label: "Hotel premium MX noche",                cat: "Viajes nacional", mxn: 4500,  note: "Marriott/Hyatt/Sheraton" },
  { id: "viatico_sat_nac",     label: "Viático SAT nacional (tope deducible)", cat: "Viajes nacional", mxn: 1968,  note: "Por día/persona · art. 28-V LISR 2026" },

  // ─── VIAJES INTERNACIONALES ─────────────────────────────────────────────────
  { id: "vuelo_mx_usa_eco",    label: "Vuelo MX-USA económica",                cat: "Viajes internacional", mxn: 8500,  note: "AeroMx/American/United" },
  { id: "vuelo_mx_usa_biz",    label: "Vuelo MX-USA business",                 cat: "Viajes internacional", mxn: 40000, note: "Solo C-level / cliente clave" },
  { id: "vuelo_mx_eu_eco",     label: "Vuelo MX-Europa económica",             cat: "Viajes internacional", mxn: 22000, note: "Iberia/AeroMx/AF" },
  { id: "hotel_sf_nyc",        label: "Hotel business SF/NYC noche",           cat: "Viajes internacional", usd: 320,   note: "$250-450 USD" },
  { id: "hotel_austin_mia",    label: "Hotel business Austin/Miami noche",     cat: "Viajes internacional", usd: 220,   note: "Mejor relación precio" },
  { id: "viatico_sat_extra",   label: "Viático SAT extranjero (tope deducible)",cat: "Viajes internacional", mxn: 3148,  note: "Por día/persona · art. 28-V LISR 2026" },
  { id: "visa_b1b2",           label: "Visa B1/B2 MRV fee (amort 10y)",        cat: "Viajes internacional", usd: 2,     note: "$185 USD una vez · vigencia 10 años", perPerson: true },
  { id: "seguro_viaje_intl",   label: "Seguro viaje internacional (1 sem)",    cat: "Viajes internacional", mxn: 650,   note: "Assist Card/AXA Schengen" },
  { id: "tarjeta_movil_roaming",label: "Roaming/eSIM viajes internac.",        cat: "Viajes internacional", mxn: 600,   note: "Holafly/Airalo/Telcel sin frontera" },

  // ─── EVENTOS Y MEETINGS ─────────────────────────────────────────────────────
  { id: "comida_cliente",      label: "Comidas con clientes (deducible 8.5%)", cat: "Eventos",        mxn: 4500,  note: "Restaurante medio · solo 8.5% deducible" },
  { id: "sala_juntas_ext",     label: "Sala juntas externa (Public/IOS)",      cat: "Eventos",        mxn: 800,   note: "Por reunión, ~3-5/mes" },
  { id: "evento_team_local",   label: "Evento equipo trimestral local",        cat: "Eventos",        mxn: 8000,  note: "Cena/actividad por equipo" },
];

export const MOVILIDAD_CATS = [...new Set(MOVILIDAD.map((item) => item.cat))];
