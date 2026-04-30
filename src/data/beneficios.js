// Beneficios, capacitación, perks, reclutamiento (mensual)
// PEPM = Per Employee Per Month. Cifras 2026.
// Cuando un ítem aplica por persona, multiplicar en App por totalPersonas.

export const BENEFICIOS = [
  // ─── SEGUROS Y SALUD MX ─────────────────────────────────────────────────────
  { id: "gmm_basico",       label: "GMM Colectivo Básico (PEPM)",            cat: "Salud MX",          mxn: 1500,  note: "Suma $1M, deducible $50k", perPerson: true },
  { id: "gmm_medio",        label: "GMM Colectivo Medio (PEPM)",             cat: "Salud MX",          mxn: 3000,  note: "Default tech · suma $3-5M", perPerson: true },
  { id: "gmm_premium",      label: "GMM Colectivo Premium (PEPM)",           cat: "Salud MX",          mxn: 5500,  note: "Suma $10M+, hospitales A", perPerson: true },
  { id: "dental",           label: "Seguro Dental colectivo (PEPM)",         cat: "Salud MX",          mxn: 350,   note: "Paquete con GMM", perPerson: true },
  { id: "vision",           label: "Seguro Visión colectivo (PEPM)",         cat: "Salud MX",          mxn: 130,   note: "Lentes + revisión", perPerson: true },
  { id: "vida_colectivo",   label: "Seguro Vida colectivo 24 SBC (PEPM)",    cat: "Salud MX",          mxn: 250,   note: "Alto valor percibido, barato", perPerson: true },
  { id: "salud_mental",     label: "Salud Mental Terapify Empresas (PEPM)",  cat: "Salud MX",          mxn: 550,   note: "4 sesiones/mes/empleado · NOM-035", perPerson: true },
  { id: "wellhub",          label: "Wellhub / Gympass (PEPM)",               cat: "Salud MX",          mxn: 700,   note: "Plan Basic+ a Gold", perPerson: true },
  { id: "pet_insurance",    label: "Pet insurance MX (PEPM)",                cat: "Salud MX",          mxn: 600,   note: "Emergente", perPerson: true },

  // ─── BENEFITS Y PERKS MX ────────────────────────────────────────────────────
  { id: "vales_despensa",   label: "Vales despensa (tope exento PEPM)",      cat: "Perks MX",          mxn: 1426,  note: "40% UMA exento ISR/IMSS · Sodexo/Pluxee/Edenred", perPerson: true },
  { id: "vales_lunch",      label: "Vales restaurante Sodexo (PEPM)",        cat: "Perks MX",          mxn: 2500,  note: "Costumbre tech", perPerson: true },
  { id: "home_office_st",   label: "Home Office stipend NOM-037 (PEPM)",     cat: "Perks MX",          mxn: 1500,  note: "Internet+luz+equipo · obligatorio si >40% remoto", perPerson: true },
  { id: "internet_st",      label: "Internet stipend (PEPM)",                cat: "Perks MX",          mxn: 600,   note: "Si no hay oficina", perPerson: true },
  { id: "snacks_office",    label: "Café / snacks oficina (PEPM)",           cat: "Perks MX",          mxn: 500,   note: "Por persona", perPerson: true },
  { id: "regalo_navideno",  label: "Regalo navideño (PEPM amortizado)",      cat: "Perks MX",          mxn: 210,   note: "$2,500/año amort", perPerson: true },
  { id: "offsite_anual",    label: "Offsite / team building (PEPM amort)",   cat: "Perks MX",          mxn: 1250,  note: "$15k/persona/año amort", perPerson: true },
  { id: "bono_productividad",label: "Bono productividad (PEPM amort)",       cat: "Perks MX",          mxn: 0,     note: "1 mes anual = 8.33% sueldo · ajustar", perPerson: true },

  // ─── CAPACITACIÓN ───────────────────────────────────────────────────────────
  { id: "udemy_business",   label: "Udemy Business (user/mes)",              cat: "Capacitación",      usd: 30,    note: "$360/año, mín 20 seats", perPerson: true },
  { id: "coursera_team",    label: "Coursera for Business (user/mes)",       cat: "Capacitación",      usd: 33,    note: "$399/año", perPerson: true },
  { id: "pluralsight",      label: "Pluralsight Premium (user/mes)",         cat: "Capacitación",      usd: 48,    note: "$579/año", perPerson: true },
  { id: "linkedin_learning",label: "LinkedIn Learning (user/mes)",           cat: "Capacitación",      usd: 32,    note: "$379/año", perPerson: true },
  { id: "oreilly",          label: "O'Reilly Online Learning (user/mes)",    cat: "Capacitación",      usd: 42,    note: "$499/año", perPerson: true },
  { id: "frontend_masters", label: "Frontend Masters (user/mes)",            cat: "Capacitación",      usd: 33,    note: "$390/año", perPerson: true },
  { id: "platzi_empresas",  label: "Platzi Empresas (user/mes)",             cat: "Capacitación",      mxn: 290,   note: "~$3,500/año vol 50+", perPerson: true },
  { id: "aws_assoc",        label: "AWS Associate cert (amort 24m)",         cat: "Capacitación",      usd: 6,     note: "$150 examen · 1 dev / 2 años", perPerson: true },
  { id: "aws_pro",          label: "AWS Professional cert (amort 24m)",      cat: "Capacitación",      usd: 13,    note: "$300 examen", perPerson: true },
  { id: "gcp_pro",          label: "GCP Professional cert (amort 24m)",      cat: "Capacitación",      usd: 8,     note: "$200 examen", perPerson: true },
  { id: "cka_cert",         label: "CKA / CKAD / CKS cert (amort 24m)",      cat: "Capacitación",      usd: 19,    note: "$445 examen", perPerson: true },
  { id: "conf_reinvent",    label: "AWS re:Invent total (amort 12m)",        cat: "Capacitación",      usd: 500,   note: "$6,000 todo incluido", perPerson: true },
  { id: "conf_talent_land", label: "Talent Land GDL (amort 12m)",            cat: "Capacitación",      mxn: 375,   note: "$4,500/año amort", perPerson: true },

  // ─── RECLUTAMIENTO ──────────────────────────────────────────────────────────
  { id: "linkedin_lite",    label: "LinkedIn Recruiter Lite",                cat: "Reclutamiento",     usd: 180,   note: "Plan team chico" },
  { id: "linkedin_corp",    label: "LinkedIn Recruiter Corporate (seat)",    cat: "Reclutamiento",     usd: 900,   note: "$10.8k/año por seat" },
  { id: "occ_premium",      label: "OCC Mundial Premium",                    cat: "Reclutamiento",     mxn: 15000, note: "Plan empresa" },
  { id: "hackerrank",       label: "HackerRank for Work Pro",                cat: "Reclutamiento",     usd: 249,   note: "Por compañía" },
  { id: "codility",         label: "Codility Starter",                       cat: "Reclutamiento",     usd: 1200,  note: "5 seats" },
  { id: "coderpad",         label: "CoderPad Interview (seat)",              cat: "Reclutamiento",     usd: 75,    note: "Por entrevistador" },
  { id: "greenhouse_ats",   label: "Greenhouse ATS",                         cat: "Reclutamiento",     usd: 650,   note: "<50 empleados" },
  { id: "workable_ats",     label: "Workable ATS",                           cat: "Reclutamiento",     usd: 299,   note: "Plan medio" },
  { id: "manatal_ats",      label: "Manatal ATS (user/mes)",                 cat: "Reclutamiento",     usd: 35,    note: "Por usuario" },
  { id: "bgcheck_mx",       label: "Background check MX (por candidato)",    cat: "Reclutamiento",     mxn: 1100,  note: "Mid-Office / Trust Network" },
  { id: "headhunter_pct",   label: "Headhunter tech MX 18-25% paquete",      cat: "Reclutamiento",     mxn: 0,     note: "% sobre salario anual · ajustar manual" },

  // ─── BENEFICIOS USA ─────────────────────────────────────────────────────────
  { id: "us_health_single", label: "Health PPO Single employer (PEPM)",      cat: "Beneficios USA",    usd: 680,   note: "84% empleador · KFF 2025", perPerson: true },
  { id: "us_health_family", label: "Health PPO Family employer (PEPM)",      cat: "Beneficios USA",    usd: 1420,  note: "75% empleador", perPerson: true },
  { id: "us_dental",        label: "Dental US (PEPM)",                       cat: "Beneficios USA",    usd: 40,    perPerson: true },
  { id: "us_vision",        label: "Vision US (PEPM)",                       cat: "Beneficios USA",    usd: 10,    perPerson: true },
  { id: "us_life",          label: "Life Insurance básico (PEPM)",           cat: "Beneficios USA",    usd: 22,    note: "1-2× salario", perPerson: true },
  { id: "us_std",           label: "Short-Term Disability (PEPM)",           cat: "Beneficios USA",    usd: 30,    perPerson: true },
  { id: "us_ltd",           label: "Long-Term Disability (PEPM)",            cat: "Beneficios USA",    usd: 35,    perPerson: true },
  { id: "us_401k_admin",    label: "401(k) admin plan (PEPM)",               cat: "Beneficios USA",    usd: 30,    perPerson: true },
  { id: "us_conf_budget",   label: "Conference budget eng senior (amort)",   cat: "Beneficios USA",    usd: 333,   note: "$4,000/año amort", perPerson: true },
  { id: "justworks_peo",    label: "Justworks PEO USA (PEPM)",               cat: "Beneficios USA",    usd: 85,    note: "Alternativa para employer of record", perPerson: true },
];

export const BENEFICIOS_CATS = [...new Set(BENEFICIOS.map((item) => item.cat))];
