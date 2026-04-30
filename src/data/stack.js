// Stack tecnologico, SaaS y proveedores - costos de referencia USD/mes (2025)
// Si `usd` es 0, la app deja modelar costo variable por usuario, por consumo o fijo.

export const STACK = [
  // DEVOPS / CI-CD
  { id: "github_team", label: "GitHub Team", cat: "DevOps / CI-CD", usd: 4, unit: "usuario/mes", note: "Repos privados + permisos" },
  { id: "github_ent", label: "GitHub Enterprise", cat: "DevOps / CI-CD", usd: 21, unit: "usuario/mes", note: "SSO + auditoria" },
  { id: "gitlab", label: "GitLab Premium", cat: "DevOps / CI-CD", usd: 29, unit: "usuario/mes", note: "DevSecOps unificado" },
  { id: "circleci", label: "CircleCI Performance", cat: "DevOps / CI-CD", usd: 30, unit: "mes", note: "6000 creditos/mes" },
  { id: "gh_actions", label: "GitHub Actions extra", cat: "DevOps / CI-CD", usd: 8, unit: "mes estimado", note: "Minutos adicionales" },
  { id: "doppler", label: "Doppler", cat: "DevOps / CI-CD", usd: 6, unit: "usuario/mes", note: "Secrets management" },
  { id: "docker_team", label: "Docker Team", cat: "DevOps / CI-CD", usd: 11, unit: "usuario/mes", note: "Registry privado" },

  // PM / GESTION
  { id: "jira", label: "Jira Standard", cat: "PM / Gestion", usd: 8.15, unit: "usuario/mes", note: "Atlassian" },
  { id: "linear", label: "Linear Business", cat: "PM / Gestion", usd: 12, unit: "usuario/mes", note: "Tracking ligero" },
  { id: "notion_team", label: "Notion Business", cat: "PM / Gestion", usd: 15, unit: "usuario/mes", note: "Docs + wiki + base de datos" },
  { id: "clickup", label: "ClickUp Business", cat: "PM / Gestion", usd: 12, unit: "usuario/mes", note: "Todo en uno" },
  { id: "basecamp", label: "Basecamp", cat: "PM / Gestion", usd: 15, unit: "mes", note: "Equipos chicos" },

  // DISENO
  { id: "figma_prof", label: "Figma Professional", cat: "Diseno", usd: 15, unit: "editor/mes", note: "Diseno colaborativo" },
  { id: "figma_org", label: "Figma Organization", cat: "Diseno", usd: 45, unit: "editor/mes", note: "Branching + governance" },
  { id: "framer", label: "Framer Pro", cat: "Diseno", usd: 20, unit: "mes", note: "Web interactivo" },
  { id: "lottie", label: "LottieFiles Pro", cat: "Diseno", usd: 19, unit: "mes", note: "Animaciones JSON" },

  // SERVERLESS / BACKEND AS A SERVICE
  { id: "firebase_blaze", label: "Firebase Blaze", cat: "Serverless / BaaS", usd: 0, unit: "variable", note: "Auth, Functions, Firestore y storage segun consumo" },
  { id: "convex", label: "Convex Pro", cat: "Serverless / BaaS", usd: 25, unit: "proyecto/mes", note: "Realtime backend" },
  { id: "supabase_edge", label: "Supabase Edge Functions", cat: "Serverless / BaaS", usd: 0, unit: "variable", note: "Ejecuciones + ancho de banda" },
  { id: "appwrite", label: "Appwrite Cloud Pro", cat: "Serverless / BaaS", usd: 15, unit: "proyecto/mes", note: "Auth + DB + functions" },
  { id: "nhost", label: "Nhost Pro", cat: "Serverless / BaaS", usd: 25, unit: "proyecto/mes", note: "GraphQL + auth + storage" },
  { id: "inngest", label: "Inngest Pro", cat: "Serverless / BaaS", usd: 0, unit: "variable", note: "Eventos y jobs serverless por ejecucion" },
  { id: "trigger_dev", label: "Trigger.dev", cat: "Serverless / BaaS", usd: 20, unit: "mes", note: "Background jobs" },

  // MONITOREO
  { id: "sentry", label: "Sentry Team", cat: "Monitoreo", usd: 26, unit: "mes", note: "Error tracking" },
  { id: "datadog_infra", label: "Datadog Infrastructure", cat: "Monitoreo", usd: 15, unit: "host/mes", note: "Metricas + APM" },
  { id: "newrelic", label: "New Relic Full Stack", cat: "Monitoreo", usd: 25, unit: "usuario/mes", note: "Observabilidad" },
  { id: "pagerduty", label: "PagerDuty Professional", cat: "Monitoreo", usd: 21, unit: "usuario/mes", note: "Alertas + on-call" },
  { id: "statuspageio", label: "Statuspage", cat: "Monitoreo", usd: 29, unit: "mes", note: "Pagina de estado" },
  { id: "checkly", label: "Checkly", cat: "Monitoreo", usd: 30, unit: "mes", note: "Monitoreo sintetico" },

  // EMAIL / COMMS
  { id: "sendgrid", label: "SendGrid Essentials 50k", cat: "Email", usd: 19.95, unit: "mes", note: "Correo transaccional" },
  { id: "sendgrid_100k", label: "SendGrid Pro 100k", cat: "Email", usd: 29.95, unit: "mes", note: "100k emails" },
  { id: "resend", label: "Resend Pro", cat: "Email", usd: 20, unit: "mes", note: "API moderna" },
  { id: "mailgun", label: "Mailgun Foundation", cat: "Email", usd: 35, unit: "mes", note: "Email + validacion" },
  { id: "twilio_sms", label: "Twilio SMS", cat: "SMS / WhatsApp", usd: 0, unit: "variable", note: "Costo por mensaje" },
  { id: "twilio_wa", label: "Twilio WhatsApp", cat: "SMS / WhatsApp", usd: 0, unit: "variable", note: "Costo por conversacion" },
  { id: "vonage", label: "Vonage SMS", cat: "SMS / WhatsApp", usd: 0, unit: "variable", note: "Costo por mensaje" },
  { id: "onesignal", label: "OneSignal Growth", cat: "Push / In-App", usd: 9, unit: "mes", note: "Push notifications" },

  // AUTH
  { id: "auth0", label: "Auth0 Essentials", cat: "Auth", usd: 23, unit: "mes (1k MAU)", note: "OIDC + MFA" },
  { id: "auth0_prof", label: "Auth0 Professional", cat: "Auth", usd: 240, unit: "mes (10k MAU)", note: "Organizaciones" },
  { id: "clerk", label: "Clerk Pro", cat: "Auth", usd: 25, unit: "mes (1k MAU)", note: "Auth moderno" },
  { id: "stytch", label: "Stytch Business", cat: "Auth", usd: 99, unit: "mes (5k MAU)", note: "Passwordless / B2B" },

  // PAGOS MX
  { id: "stripe_mx", label: "Stripe Mexico", cat: "Pagos MX", usd: 0, unit: "variable", note: "Comision por transaccion" },
  { id: "conekta", label: "Conekta", cat: "Pagos MX", usd: 0, unit: "variable", note: "Tarifa por transaccion" },
  { id: "openpay", label: "Openpay", cat: "Pagos MX", usd: 0, unit: "variable", note: "Tarifa por transaccion" },
  { id: "clip", label: "Clip", cat: "Pagos MX", usd: 0, unit: "variable", note: "Tarifa por transaccion" },
  { id: "mercadopago", label: "Mercado Pago MX", cat: "Pagos MX", usd: 0, unit: "variable", note: "Tarifa por transaccion" },
  { id: "kushki", label: "Kushki Latam", cat: "Pagos MX", usd: 0, unit: "variable", note: "Tarifa por transaccion" },

  // ANALYTICS
  { id: "ga4", label: "Google Analytics 4", cat: "Analytics", usd: 0, unit: "gratis", note: "Basico" },
  { id: "mixpanel_grow", label: "Mixpanel Growth", cat: "Analytics", usd: 28, unit: "mes (1k MTU)", note: "Product analytics" },
  { id: "amplitude", label: "Amplitude Starter", cat: "Analytics", usd: 0, unit: "gratis", note: "Freemium" },
  { id: "posthog", label: "PostHog Cloud", cat: "Analytics", usd: 0, unit: "variable", note: "Eventos y replays segun consumo" },
  { id: "hotjar", label: "Hotjar Business", cat: "Analytics", usd: 99, unit: "mes", note: "Heatmaps" },
  { id: "logrocket", label: "LogRocket Pro", cat: "Analytics", usd: 99, unit: "mes", note: "Session replay" },

  // SEARCH
  { id: "algolia", label: "Algolia Grow", cat: "Search", usd: 50, unit: "mes", note: "Busqueda administrada" },
  { id: "typesense", label: "Typesense Cloud", cat: "Search", usd: 24, unit: "mes", note: "Open source" },
  { id: "meilisearch", label: "Meilisearch Cloud", cat: "Search", usd: 30, unit: "mes", note: "Rapido" },

  // CMS
  { id: "contentful", label: "Contentful Basic", cat: "CMS", usd: 300, unit: "mes", note: "CMS enterprise" },
  { id: "sanity", label: "Sanity Growth", cat: "CMS", usd: 15, unit: "mes", note: "Headless flexible" },
  { id: "strapi_cloud", label: "Strapi Cloud Essential", cat: "CMS", usd: 29, unit: "mes", note: "Open source + cloud" },
  { id: "wordpress_vip", label: "WordPress.com Business", cat: "CMS", usd: 25, unit: "mes", note: "Sitios basados en WP" },

  // CRM
  { id: "hubspot_str", label: "HubSpot Starter CRM", cat: "CRM", usd: 20, unit: "mes", note: "2 usuarios incluidos" },
  { id: "hubspot_pro", label: "HubSpot Professional", cat: "CRM", usd: 890, unit: "mes", note: "Marketing automation" },
  { id: "pipedrive", label: "Pipedrive Essential", cat: "CRM", usd: 14, unit: "usuario/mes", note: "Sales CRM" },
  { id: "intercom", label: "Intercom Starter", cat: "CRM", usd: 39, unit: "mes", note: "Soporte + chat" },
  { id: "zendesk", label: "Zendesk Suite Team", cat: "CRM", usd: 55, unit: "agente/mes", note: "Atencion al cliente" },

  // FACTURACION MX
  { id: "facturapi", label: "Facturapi", cat: "Facturacion MX", usd: 0, unit: "variable", note: "Plan mensual + timbres CFDI" },
  { id: "sat_ws", label: "SW Sapien", cat: "Facturacion MX", usd: 0, unit: "variable", note: "Plan mensual + folios" },
  { id: "finkok", label: "Finkok", cat: "Facturacion MX", usd: 0, unit: "variable", note: "Plan mensual + timbres" },

  // MAPAS
  { id: "gmaps", label: "Google Maps Platform", cat: "Mapas", usd: 0, unit: "variable", note: "Consumo por API" },
  { id: "mapbox", label: "Mapbox Pro", cat: "Mapas", usd: 50, unit: "mes estimado", note: "50k map loads" },
  { id: "radar_io", label: "Radar", cat: "Mapas", usd: 0, unit: "gratis / variable", note: "Geofencing API" },

  // META APIS
  { id: "meta_wa_biz", label: "Meta WhatsApp Business API", cat: "Meta APIs", usd: 0, unit: "variable", note: "Costo por conversacion" },
  { id: "meta_wa_conv", label: "Meta WA ~500 conv/mes", cat: "Meta APIs", usd: 25, unit: "mes estimado", note: "Escenario base" },
  { id: "meta_wa_2k", label: "Meta WA ~2000 conv/mes", cat: "Meta APIs", usd: 80, unit: "mes estimado", note: "Escenario medio" },
  { id: "meta_ads_api", label: "Meta Marketing API", cat: "Meta APIs", usd: 0, unit: "gratis", note: "No incluye media spend" },
  { id: "meta_graph", label: "Meta Graph API", cat: "Meta APIs", usd: 0, unit: "gratis", note: "Lectura social" },
  { id: "instagram_api", label: "Instagram Display API", cat: "Meta APIs", usd: 0, unit: "gratis", note: "Embeds y datos basicos" },
  { id: "threads_api", label: "Threads API", cat: "Meta APIs", usd: 0, unit: "gratis", note: "Publicacion y lectura" },
  { id: "meta_llama_api", label: "Meta Llama API hosted", cat: "Meta APIs", usd: 0, unit: "variable", note: "Dependiente del pricing publicado" },
];

export const STACK_CATS = [...new Set(STACK.map((item) => item.cat))];
