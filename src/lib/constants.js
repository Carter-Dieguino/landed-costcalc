export const DEFAULT_FX = 18.5;
export const DEFAULT_PROJECT = { name: "", client: "", version: "1.0", description: "" };
export const DEFAULT_SELLER = { id: 1, name: "", role: "Vendedor / BDR", commPct: 10, appliesToNet: false };
export const FX_API_URL = "https://open.er-api.com/v6/latest/USD";
export const CONFIG_VERSION = "2.0";
export const STORAGE_KEY = "costcalc:state:v2";
export const STORAGE_DEBOUNCE_MS = 500;

export const MODE_OPTIONS = [
  { value: "freelancer", label: "Freelancer", desc: "Tarifa por hora basada en costos personales + margen." },
  { value: "project",    label: "Proyecto",   desc: "Costo total del proyecto incluyendo equipo, recursos y meses." },
  { value: "org",        label: "Organización", desc: "Burn rate mensual y run rate anual de la operación." },
];

export const THEME_OPTIONS = [
  { value: "system", label: "Sistema" },
  { value: "dark",   label: "Dark" },
  { value: "light",  label: "Light" },
];

export const TABS = [
  { id: "human",    icon: "Equ",  label: "Capital Humano",  group: "people", modes: ["freelancer", "project", "org"] },
  { id: "benef",    icon: "Ben",  label: "Beneficios",      group: "people", modes: ["project", "org"] },
  { id: "equipos",  icon: "HW",   label: "Equipos",         group: "phys",   modes: ["freelancer", "project", "org"] },
  { id: "oficina",  icon: "Off",  label: "Oficina",         group: "phys",   modes: ["freelancer", "project", "org"] },
  { id: "movil",    icon: "Mov",  label: "Movilidad",       group: "phys",   modes: ["freelancer", "project", "org"] },
  { id: "infra",    icon: "Ops",  label: "Infra",           group: "tech",   modes: ["freelancer", "project", "org"] },
  { id: "stack",    icon: "SaaS", label: "Stack",           group: "tech",   modes: ["freelancer", "project", "org"] },
  { id: "ai",       icon: "AI",   label: "IA & ML",         group: "tech",   modes: ["freelancer", "project", "org"] },
  { id: "admin",    icon: "Adm",  label: "Admin & Legal",   group: "biz",    modes: ["freelancer", "project", "org"] },
  { id: "comision", icon: "%",    label: "Comisiones",      group: "biz",    modes: ["project", "org"] },
  { id: "fiscal",   icon: "SAT",  label: "Fiscal",          group: "biz",    modes: ["freelancer", "project", "org"] },
  { id: "summary",  icon: "Sum",  label: "Resumen",         group: "out",    modes: ["freelancer", "project", "org"] },
];

export const TAB_GROUPS = [
  { id: "people", label: "Personas",   color: "var(--accent)" },
  { id: "phys",   label: "Físico",     color: "var(--accent-blue)" },
  { id: "tech",   label: "Tech",       color: "var(--warning)" },
  { id: "biz",    label: "Negocio",    color: "var(--text-2)" },
  { id: "out",    label: "Resultado",  color: "var(--accent-alt)" },
];

export const USAGE_STEPS_BY_MODE = {
  freelancer: [
    "Selecciona modo Freelancer y define horas/mes que cobras (160 = full-time típico).",
    "Activa solo TUS costos personales: laptop amortizada, internet, software, GMM, contador.",
    "Margen aquí es el % adicional sobre tu costo para llegar a la tarifa al cliente.",
    "Resumen: revisa la tarifa por hora mínima sostenible y la facturación anual implícita.",
  ],
  project: [
    "Define tipo de cambio, meses, margen y contingencia para este proyecto.",
    "Activa perfiles de equipo, infra, SaaS e IA; solo cuenta lo seleccionado.",
    "Usa costos variables x volumen o usuarios para aproximar el consumo real del mes.",
    "Resumen: utilidad bruta NO incluye impuestos. Utilidad neta los estima orientativamente.",
  ],
  org: [
    "Modo Organización: estás midiendo el burn mensual de la operación, no un proyecto puntual.",
    "Activa todo lo que pagas mes a mes: equipo de planta, infra y SaaS recurrente, IA en producción.",
    "El margen aquí es el buffer sobre el costo operativo para definir el revenue mínimo necesario.",
    "Resumen muestra burn mensual, run rate anual y carga fiscal estimada para sostener la operación.",
  ],
};

export const emptyObject = Object.freeze({});
