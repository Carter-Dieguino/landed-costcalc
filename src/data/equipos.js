// Equipos / hardware - costo mensual amortizado USD (Q1 2026)
// Vida útil asumida: laptops 48m, monitores 72m, sillas premium 144m,
// periféricos 60m, móviles 24m. amortMXN/amortUSD = precio_lista / vida_meses.
// Si tu empresa los compra una vez, dividir el precio entre los meses del proyecto.

export const EQUIPOS = [
  // ─── LAPTOPS DEV ────────────────────────────────────────────────────────────
  { id: "mbp14_m4_base",  label: "MacBook Pro 14\" M4 base",           cat: "Laptop Dev",      usd: 33,  note: "Lista MX $36,499 / US $1,599 · amort 48m" },
  { id: "mbp14_m4_pro",   label: "MacBook Pro 14\" M4 Pro 24/512",     cat: "Laptop Dev",      usd: 42,  note: "Default senior dev MX" },
  { id: "mbp16_m4_max",   label: "MacBook Pro 16\" M4 Max 36/1TB",     cat: "Laptop Dev",      usd: 73,  note: "ML/IA local · diseño 3D" },
  { id: "dell_xps15",     label: "Dell XPS 15 9540 i7/16/512",         cat: "Laptop Dev",      usd: 40,  note: "Alternativa Windows premium" },
  { id: "thinkpad_x1c13", label: "ThinkPad X1 Carbon Gen 13 32/1TB",   cat: "Laptop Dev",      usd: 42,  note: "Estándar enterprise Linux/Win" },
  { id: "ws_rtx4080",     label: "Workstation RTX 4080 64GB RAM",      cat: "Laptop Dev",      usd: 115, note: "Fine-tuning IA local · 3D" },

  // ─── LAPTOPS BASE (QA / PM / Admin) ─────────────────────────────────────────
  { id: "mba_m3",         label: "MacBook Air 13\" M3 16/256",         cat: "Laptop Base",     usd: 23,  note: "Default no-dev en startups MX" },
  { id: "latitude_5450",  label: "Dell Latitude 5450 i5/16/512",       cat: "Laptop Base",     usd: 26,  note: "Estándar corporativo" },
  { id: "thinkpad_e14",   label: "ThinkPad E14 i5/16/512",             cat: "Laptop Base",     usd: 22,  note: "Mejor precio/calidad business" },
  { id: "probook_450",    label: "HP ProBook 450 G11",                 cat: "Laptop Base",     usd: 23,  note: "Común en flotas grandes" },

  // ─── MONITORES ──────────────────────────────────────────────────────────────
  { id: "mon_dell_qhd",   label: "Dell U2724DE 27\" QHD",              cat: "Monitor",         usd: 7,   note: "Estándar dev · amort 72m" },
  { id: "mon_dell_4k",    label: "Dell U2725QE 27\" 4K",               cat: "Monitor",         usd: 9,   note: "4K productividad" },
  { id: "mon_lg_4k",      label: "LG 27UP850 27\" 4K",                 cat: "Monitor",         usd: 6,   note: "Económico 4K" },
  { id: "mon_lg_uw",      label: "LG 34WP65C ultrawide 34\"",          cat: "Monitor",         usd: 8,   note: "Multitarea dev" },
  { id: "mon_studio",     label: "Apple Studio Display 27\" 5K",       cat: "Monitor",         usd: 22,  note: "Diseño / video pro" },
  { id: "mon_dell_49",    label: "Dell U4924DW ultrawide 49\"",        cat: "Monitor",         usd: 19,  note: "Trader / data viz" },

  // ─── PERIFÉRICOS ────────────────────────────────────────────────────────────
  { id: "logi_combo",     label: "Logitech MX Keys + MX Master 3S",    cat: "Periférico",      usd: 3,   note: "Combo · amort 60m" },
  { id: "keychron_q1",    label: "Keychron Q1 / K8 mecánico",          cat: "Periférico",      usd: 3,   note: "Mech premium" },
  { id: "brio_500",       label: "Logitech Brio 500 1080p",            cat: "Periférico",      usd: 2,   note: "Webcam estándar" },
  { id: "brio_4k",        label: "Logitech Brio 4K Pro",               cat: "Periférico",      usd: 3,   note: "Streaming exec" },
  { id: "wh1000xm5",      label: "Sony WH-1000XM5",                    cat: "Periférico",      usd: 5,   note: "Audífonos NC" },
  { id: "airpods_pro",    label: "AirPods Pro 2",                      cat: "Periférico",      usd: 7,   note: "Standard issue Apple" },
  { id: "blue_yeti",      label: "Blue Yeti USB",                      cat: "Periférico",      usd: 2,   note: "Mic podcast básico" },
  { id: "shure_mv7p",     label: "Shure MV7+",                         cat: "Periférico",      usd: 4,   note: "Mic podcast pro" },

  // ─── ESTACIÓN / ERGONOMÍA ───────────────────────────────────────────────────
  { id: "caldigit_ts4",   label: "CalDigit TS4 Thunderbolt 4 dock",    cat: "Estación",        usd: 6,   note: "Dock premium · amort 72m" },
  { id: "anker_568",      label: "Anker 568 USB-C dock",               cat: "Estación",        usd: 4,   note: "Alternativa económica" },
  { id: "aeron_b",        label: "Herman Miller Aeron talla B",        cat: "Estación",        usd: 12,  note: "Vida 12y · MX 50% premium vs US" },
  { id: "sayl",           label: "Herman Miller Sayl",                 cat: "Estación",        usd: 5,   note: "Económica HM" },
  { id: "cosm",           label: "Herman Miller Cosm",                 cat: "Estación",        usd: 9,   note: "Premium tope HM" },
  { id: "steelcase_s1",   label: "Steelcase Series 1",                 cat: "Estación",        usd: 4,   note: "Mejor precio premium" },
  { id: "silla_basic",    label: "Silla ergonómica genérica",          cat: "Estación",        usd: 6,   note: "ML / Amazon · vida 4y" },
  { id: "flexispot_e7",   label: "FlexiSpot E7 sit/stand",             cat: "Estación",        usd: 4,   note: "Escritorio motorizado" },
  { id: "desk_basic",     label: "Escritorio fijo 1.5m",               cat: "Estación",        usd: 2,   note: "Office Depot" },

  // ─── MÓVIL CORPORATIVO ──────────────────────────────────────────────────────
  { id: "iphone16",       label: "iPhone 16 128GB",                    cat: "Móvil",           usd: 33,  note: "Default corp · amort 24m" },
  { id: "iphone16_pro",   label: "iPhone 16 Pro 128GB",                cat: "Móvil",           usd: 42,  note: "MX $26,499 / US $999" },
  { id: "iphone16_max",   label: "iPhone 16 Pro Max 256GB",            cat: "Móvil",           usd: 50,  note: "MX $32,999" },
  { id: "samsung_s25",    label: "Samsung Galaxy S25 256GB",           cat: "Móvil",           usd: 37,  note: "Android flagship" },
  { id: "pixel_9",        label: "Google Pixel 9 (importado)",         cat: "Móvil",           usd: 33,  note: "No oficial MX, importación gris" },

  // ─── DEVICES TESTING ────────────────────────────────────────────────────────
  { id: "ipad_10",        label: "iPad 10th gen 64GB testing",         cat: "Testing",         usd: 5,   note: "QA iOS" },
  { id: "ipad_pro_m4",    label: "iPad Pro M4 11\"",                   cat: "Testing",         usd: 14,  note: "Diseño / QA premium" },
  { id: "tab_a9",         label: "Samsung Tab A9+ testing",            cat: "Testing",         usd: 5,   note: "QA Android medio" },
  { id: "android_budget", label: "Tablet Android budget",              cat: "Testing",         usd: 2,   note: "Lanix / Hyundai · low-end" },
  { id: "redmi_note",     label: "Xiaomi Redmi Note 13",               cat: "Testing",         usd: 4,   note: "QA Android cheap" },

  // ─── ON-PREM / NAS ──────────────────────────────────────────────────────────
  { id: "synology_923",   label: "Synology DS923+ + 32TB HDDs",        cat: "On-prem",         usd: 22,  note: "NAS 4-bay · amort 60m" },
  { id: "ups_1500",       label: "APC Smart-UPS 1500VA",               cat: "On-prem",         usd: 7,   note: "Vida 6 años" },
  { id: "unifi_switch",   label: "Ubiquiti UniFi 24p switch",          cat: "On-prem",         usd: 4,   note: "Switch managed" },
];

export const EQUIPOS_CATS = [...new Set(EQUIPOS.map((item) => item.cat))];
