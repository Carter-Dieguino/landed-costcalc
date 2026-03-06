// Stack tecnológico, SaaS y proveedores — precios USD/mes (2025)

export const STACK = [
  // ─── REPOSITORIOS / CI-CD ──────────────────────────────────────
  { id: "github_team",   label: "GitHub Team",              cat: "DevOps / CI-CD",  usd: 4.00,   unit: "usuario/mes",      note: "" },
  { id: "github_ent",    label: "GitHub Enterprise",        cat: "DevOps / CI-CD",  usd: 21.00,  unit: "usuario/mes",      note: "" },
  { id: "gitlab",        label: "GitLab Premium",           cat: "DevOps / CI-CD",  usd: 29.00,  unit: "mes (5 usuarios)", note: "" },
  { id: "circleci",      label: "CircleCI Performance",     cat: "DevOps / CI-CD",  usd: 30.00,  unit: "mes",              note: "6000 créditos/mes" },
  { id: "gh_actions",    label: "GitHub Actions Extra",     cat: "DevOps / CI-CD",  usd: 8.00,   unit: "mes est.",         note: "3000 min incluidos free" },
  { id: "doppler",       label: "Doppler (Secrets Mgmt)",   cat: "DevOps / CI-CD",  usd: 6.00,   unit: "usuario/mes",      note: "Variables de entorno seguras" },
  { id: "docker_team",   label: "Docker Team",              cat: "DevOps / CI-CD",  usd: 11.00,  unit: "usuario/mes",      note: "Registry privado" },
  // ─── GESTIÓN DE PROYECTOS ──────────────────────────────────────
  { id: "jira",          label: "Jira Standard",            cat: "PM / Gestión",    usd: 8.15,   unit: "usuario/mes",      note: "Atlassian" },
  { id: "linear",        label: "Linear (Business)",        cat: "PM / Gestión",    usd: 12.00,  unit: "usuario/mes",      note: "Moderno · velocidad" },
  { id: "notion_team",   label: "Notion Business",          cat: "PM / Gestión",    usd: 15.00,  unit: "usuario/mes",      note: "Docs + Wiki + DB" },
  { id: "clickup",       label: "ClickUp Business",         cat: "PM / Gestión",    usd: 12.00,  unit: "usuario/mes",      note: "Todo-en-uno" },
  { id: "basecamp",      label: "Basecamp",                 cat: "PM / Gestión",    usd: 15.00,  unit: "mes (ilimitado)",   note: "Equipos pequeños" },
  // ─── DISEÑO ───────────────────────────────────────────────────
  { id: "figma_prof",    label: "Figma Professional",       cat: "Diseño",          usd: 15.00,  unit: "editor/mes",       note: "" },
  { id: "figma_org",     label: "Figma Organization",       cat: "Diseño",          usd: 45.00,  unit: "editor/mes",       note: "Branching + permisos" },
  { id: "framer",        label: "Framer Pro",               cat: "Diseño",          usd: 20.00,  unit: "mes",              note: "Web interactivo sin código" },
  { id: "lottie",        label: "LottieFiles Pro",          cat: "Diseño",          usd: 19.00,  unit: "mes",              note: "Animaciones JSON" },
  // ─── MONITOREO / OBSERVABILIDAD ────────────────────────────────
  { id: "sentry",        label: "Sentry Team",              cat: "Monitoreo",       usd: 26.00,  unit: "mes",              note: "Error tracking · 5k errs/mes" },
  { id: "datadog_infra", label: "Datadog Infrastructure",   cat: "Monitoreo",       usd: 15.00,  unit: "host/mes",         note: "Métricas + APM" },
  { id: "newrelic",      label: "New Relic Full Stack",     cat: "Monitoreo",       usd: 25.00,  unit: "usuario/mes",      note: "APM completo" },
  { id: "pagerduty",     label: "PagerDuty Professional",   cat: "Monitoreo",       usd: 21.00,  unit: "usuario/mes",      note: "Alertas + on-call" },
  { id: "statuspageio",  label: "Atlassian Statuspage",     cat: "Monitoreo",       usd: 29.00,  unit: "mes",              note: "Página de estado pública" },
  { id: "checkly",       label: "Checkly (E2E monitoring)", cat: "Monitoreo",       usd: 30.00,  unit: "mes",              note: "Tests sintéticos en prod" },
  // ─── COMUNICACIÓN / NOTIFICACIONES ────────────────────────────
  { id: "sendgrid",      label: "SendGrid Essentials 50k",  cat: "Email",           usd: 19.95,  unit: "mes",              note: "50k emails transaccionales" },
  { id: "sendgrid_100k", label: "SendGrid Pro 100k",        cat: "Email",           usd: 29.95,  unit: "mes",              note: "100k emails/mes" },
  { id: "resend",        label: "Resend Pro",               cat: "Email",           usd: 20.00,  unit: "mes",              note: "50k emails · API moderno" },
  { id: "mailgun",       label: "Mailgun Foundation",       cat: "Email",           usd: 35.00,  unit: "mes",              note: "50k emails + validación" },
  { id: "twilio_sms",    label: "Twilio SMS est. 2000/mes", cat: "SMS / WhatsApp",  usd: 15.00,  unit: "mes est.",         note: "$0.0075/msg USA · $0.01 MX" },
  { id: "twilio_wa",     label: "Twilio WhatsApp 1000/mes", cat: "SMS / WhatsApp",  usd: 12.00,  unit: "mes est.",         note: "$0.005 por conversación" },
  { id: "vonage",        label: "Vonage (nexmo) SMS",       cat: "SMS / WhatsApp",  usd: 10.00,  unit: "mes est.",         note: "SMS API — alternativa Twilio" },
  { id: "onesignal",     label: "OneSignal Growth",         cat: "Push / In-App",   usd: 9.00,   unit: "mes",              note: "Push notifications" },
  // ─── AUTENTICACIÓN ────────────────────────────────────────────
  { id: "auth0",         label: "Auth0 Essentials",         cat: "Auth",            usd: 23.00,  unit: "mes (1k MAU)",     note: "OIDC · MFA · Social login" },
  { id: "auth0_prof",    label: "Auth0 Professional",       cat: "Auth",            usd: 240.00, unit: "mes (10k MAU)",    note: "Organizaciones" },
  { id: "clerk",         label: "Clerk Pro",                cat: "Auth",            usd: 25.00,  unit: "mes (1k MAU)",     note: "Auth moderno para Next.js" },
  { id: "stytch",        label: "Stytch Business",          cat: "Auth",            usd: 99.00,  unit: "mes (5k MAU)",     note: "Passwordless · B2B" },
  // ─── PAGOS MÉXICO ──────────────────────────────────────────────
  { id: "stripe_mx",     label: "Stripe México",            cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "3.6% + $3 MXN por txn nacional" },
  { id: "conekta",       label: "Conekta",                  cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "2.9% + $3 MXN · OXXO · SPEI" },
  { id: "openpay",       label: "Openpay (BBVA)",           cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "3.0% + $2.5 MXN · nativa MX" },
  { id: "clip",          label: "Clip (POS + API)",         cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "3.6% · POS físico disponible" },
  { id: "mercadopago",   label: "Mercado Pago MX",          cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "3.49% + IVA · amplio alcance MX" },
  { id: "kushki",        label: "Kushki Latam",             cat: "Pagos MX",        usd: 0,      unit: "variable",         note: "2.5% + $2 MXN · multi-país" },
  // ─── ANALYTICS ────────────────────────────────────────────────
  { id: "ga4",           label: "Google Analytics 4",       cat: "Analytics",       usd: 0,      unit: "gratis",           note: "Básico sin costo" },
  { id: "mixpanel_grow", label: "Mixpanel Growth",          cat: "Analytics",       usd: 28.00,  unit: "mes (1k MTU)",     note: "Product analytics" },
  { id: "amplitude",     label: "Amplitude Starter",        cat: "Analytics",       usd: 0,      unit: "hasta 10M eventos",note: "Freemium" },
  { id: "posthog",       label: "PostHog Cloud",            cat: "Analytics",       usd: 0,      unit: "hasta 1M eventos", note: "Open source · self-host opción" },
  { id: "hotjar",        label: "Hotjar Business",          cat: "Analytics",       usd: 99.00,  unit: "mes",              note: "Heatmaps · grabaciones" },
  { id: "logrocket",     label: "LogRocket Pro",            cat: "Analytics",       usd: 99.00,  unit: "mes",              note: "Session replay + errores" },
  // ─── SEARCH ────────────────────────────────────────────────────
  { id: "algolia",       label: "Algolia Grow",             cat: "Search",          usd: 50.00,  unit: "mes",              note: "10k ops · relevancia premium" },
  { id: "typesense",     label: "Typesense Cloud",          cat: "Search",          usd: 24.00,  unit: "mes",              note: "Open source · alternativa Algolia" },
  { id: "meilisearch",   label: "Meilisearch Cloud",        cat: "Search",          usd: 30.00,  unit: "mes",              note: "Fast · open source" },
  // ─── CMS / CONTENIDO ──────────────────────────────────────────
  { id: "contentful",    label: "Contentful Basic",         cat: "CMS",             usd: 300.00, unit: "mes",              note: "Headless CMS enterprise" },
  { id: "sanity",        label: "Sanity Growth",            cat: "CMS",             usd: 15.00,  unit: "mes",              note: "Headless CMS flexible" },
  { id: "strapi_cloud",  label: "Strapi Cloud Essential",   cat: "CMS",             usd: 29.00,  unit: "mes",              note: "Open source + cloud" },
  { id: "wordpress_vip", label: "WordPress.com Business",   cat: "CMS",             usd: 25.00,  unit: "mes",              note: "Para proyectos con WP" },
  // ─── CRM / MARKETING ──────────────────────────────────────────
  { id: "hubspot_str",   label: "HubSpot Starter CRM",      cat: "CRM",             usd: 20.00,  unit: "mes",              note: "2 usuarios incluidos" },
  { id: "hubspot_pro",   label: "HubSpot Professional",     cat: "CRM",             usd: 890.00, unit: "mes",              note: "Marketing automation completo" },
  { id: "pipedrive",     label: "Pipedrive Essential",      cat: "CRM",             usd: 14.00,  unit: "usuario/mes",      note: "Sales CRM" },
  { id: "intercom",      label: "Intercom Starter",         cat: "CRM",             usd: 39.00,  unit: "mes",              note: "Soporte + chat + bots" },
  { id: "zendesk",       label: "Zendesk Suite Team",       cat: "CRM",             usd: 55.00,  unit: "agente/mes",       note: "Soporte al cliente" },
  // ─── FACTURACIÓN MX ───────────────────────────────────────────
  { id: "facturapi",     label: "Facturapi Pro",            cat: "Facturación MX",  usd: 0,      unit: "MXN",              note: "$499 MXN/mes · CFDI SAT API" },
  { id: "sat_ws",        label: "SW SAPien (CFDI)",         cat: "Facturación MX",  usd: 0,      unit: "MXN",              note: "$350 MXN/mes · folios incluidos" },
  { id: "finkok",        label: "Finkok CFDI",              cat: "Facturación MX",  usd: 0,      unit: "MXN",              note: "est. $400 MXN/mes + timbres" },
  // ─── MAPAS / GEOLOCALIZACIÓN ───────────────────────────────────
  { id: "gmaps",        label: "Google Maps Platform",     cat: "Mapas",           usd: 0,      unit: "variable",         note: "$200 crédito/mes gratuito · Maps JS, Geocoding, Directions" },
  { id: "mapbox",       label: "Mapbox Pro",               cat: "Mapas",           usd: 50.00,  unit: "mes est.",         note: "50k map loads/mes" },
  { id: "radar_io",     label: "Radar (Geofencing)",       cat: "Mapas",           usd: 0,      unit: "gratis hasta 100k",note: "Geofencing API" },
  // ─── META / FACEBOOK APIs ─────────────────────────────────────
  { id: "meta_wa_biz",  label: "Meta WhatsApp Business API", cat: "Meta APIs",     usd: 0,      unit: "variable",         note: "~$0.06/conv marketing · $0.02/conv utilidad MX" },
  { id: "meta_wa_conv", label: "Meta WA ~500 conv/mes",    cat: "Meta APIs",       usd: 25.00,  unit: "mes est.",          note: "500 conversaciones mixtas est. · directo Meta" },
  { id: "meta_wa_2k",   label: "Meta WA ~2000 conv/mes",   cat: "Meta APIs",       usd: 80.00,  unit: "mes est.",          note: "2000 conversaciones mixtas est." },
  { id: "meta_ads_api", label: "Meta Marketing API",       cat: "Meta APIs",       usd: 0,      unit: "gratis",           note: "API sin costo — pagas el presupuesto de anuncios aparte" },
  { id: "meta_graph",   label: "Meta Graph API (FB/IG)",   cat: "Meta APIs",       usd: 0,      unit: "gratis",           note: "Lectura social · 200 req/hr por token" },
  { id: "instagram_api",label: "Instagram Display API",    cat: "Meta APIs",       usd: 0,      unit: "gratis",           note: "Feed, stories embed · límite de llamadas" },
  { id: "threads_api",  label: "Threads API",              cat: "Meta APIs",       usd: 0,      unit: "gratis",           note: "Publicación y lectura · en beta 2025" },
  { id: "meta_llama_api",label:"Meta Llama API (hosted)",  cat: "Meta APIs",       usd: 0,      unit: "variable",         note: "Llama 3.x vía Meta AI API — pricing en revisión 2025" },
];

export const STACK_CATS = [...new Set(STACK.map(s => s.cat))];
