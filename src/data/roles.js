// Salarios mensuales en MXN — Mercado México 2025
// Fuente: OCC Mundial, LinkedIn Salary, Glassdoor MX, encuestas comunidad dev

export const ROLES = [
  // Liderazgo técnico
  { id: "cto",      label: "CTO / Director Técnico",       cat: "Liderazgo",    minMXN: 90000,  maxMXN: 180000 },
  { id: "arch",     label: "Arquitecto de Software",        cat: "Liderazgo",    minMXN: 75000,  maxMXN: 140000 },
  { id: "techlead", label: "Tech Lead",                     cat: "Liderazgo",    minMXN: 65000,  maxMXN: 120000 },
  // Backend
  { id: "be_sr",    label: "Backend Senior",                cat: "Backend",      minMXN: 48000,  maxMXN: 90000  },
  { id: "be_mid",   label: "Backend Mid",                   cat: "Backend",      minMXN: 28000,  maxMXN: 52000  },
  { id: "be_jr",    label: "Backend Junior",                cat: "Backend",      minMXN: 14000,  maxMXN: 28000  },
  // Frontend
  { id: "fe_sr",    label: "Frontend Senior",               cat: "Frontend",     minMXN: 45000,  maxMXN: 88000  },
  { id: "fe_mid",   label: "Frontend Mid",                  cat: "Frontend",     minMXN: 25000,  maxMXN: 48000  },
  { id: "fe_jr",    label: "Frontend Junior",               cat: "Frontend",     minMXN: 12000,  maxMXN: 25000  },
  // Full Stack
  { id: "fs_sr",    label: "Full Stack Senior",             cat: "Full Stack",   minMXN: 52000,  maxMXN: 95000  },
  { id: "fs_mid",   label: "Full Stack Mid",                cat: "Full Stack",   minMXN: 30000,  maxMXN: 55000  },
  // Mobile
  { id: "ios",      label: "iOS Developer (Swift)",         cat: "Mobile",       minMXN: 42000,  maxMXN: 82000  },
  { id: "android",  label: "Android Developer (Kotlin)",    cat: "Mobile",       minMXN: 40000,  maxMXN: 80000  },
  { id: "rn",       label: "React Native / Flutter Dev",    cat: "Mobile",       minMXN: 38000,  maxMXN: 75000  },
  // Infra / Cloud
  { id: "devops",   label: "DevOps Engineer",               cat: "Infra",        minMXN: 55000,  maxMXN: 100000 },
  { id: "sre",      label: "SRE / Platform Engineer",       cat: "Infra",        minMXN: 60000,  maxMXN: 110000 },
  { id: "cloud",    label: "Cloud Architect",               cat: "Infra",        minMXN: 70000,  maxMXN: 130000 },
  // Data / AI
  { id: "ds",       label: "Data Scientist",                cat: "Data / AI",    minMXN: 52000,  maxMXN: 100000 },
  { id: "mle",      label: "ML Engineer",                   cat: "Data / AI",    minMXN: 58000,  maxMXN: 115000 },
  { id: "de",       label: "Data Engineer",                 cat: "Data / AI",    minMXN: 50000,  maxMXN: 95000  },
  { id: "da",       label: "Data Analyst",                  cat: "Data / AI",    minMXN: 28000,  maxMXN: 60000  },
  // Calidad
  { id: "qa_sr",    label: "QA Engineer Senior",            cat: "QA",           minMXN: 35000,  maxMXN: 65000  },
  { id: "qa_auto",  label: "QA Automation Engineer",        cat: "QA",           minMXN: 40000,  maxMXN: 75000  },
  { id: "qa_jr",    label: "QA Manual Junior",              cat: "QA",           minMXN: 14000,  maxMXN: 28000  },
  // Diseño
  { id: "uxui_sr",  label: "UX/UI Designer Senior",         cat: "Diseño",       minMXN: 40000,  maxMXN: 75000  },
  { id: "uxui_mid", label: "UX/UI Designer Mid",            cat: "Diseño",       minMXN: 22000,  maxMXN: 42000  },
  { id: "uxr",      label: "UX Researcher",                 cat: "Diseño",       minMXN: 35000,  maxMXN: 65000  },
  // Gestión
  { id: "pm",       label: "Product Manager",               cat: "Gestión",      minMXN: 50000,  maxMXN: 95000  },
  { id: "po",       label: "Product Owner",                 cat: "Gestión",      minMXN: 40000,  maxMXN: 75000  },
  { id: "scrum",    label: "Scrum Master",                  cat: "Gestión",      minMXN: 35000,  maxMXN: 65000  },
  // Seguridad
  { id: "sec",      label: "Security Engineer",             cat: "Seguridad",    minMXN: 60000,  maxMXN: 120000 },
  { id: "pentest",  label: "Pentester / Ethical Hacker",    cat: "Seguridad",    minMXN: 45000,  maxMXN: 90000  },
];

export const ROLE_CATS = [...new Set(ROLES.map(r => r.cat))];

// Factor de carga social México (IMSS + INFONAVIT + vacaciones + aguinaldo + PTU)
export const CARGA_SOCIAL_FACTOR = 0.30;
