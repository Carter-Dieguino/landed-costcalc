# CostCalc — Estimador de Proyectos Tech

Calculadora de costos para proyectos tecnológicos, optimizada para el **mercado mexicano** con precios reales de proveedores globales y locales.

## Stack

- React 18 + Vite 7
- Sin dependencias externas — CSS-in-JS puro
- Listo para Cloudflare Pages

## Desarrollo local

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
# Output en ./dist/
```

## Deploy en Cloudflare Pages

1. Sube el repositorio a GitHub
2. En Cloudflare Pages → "Connect to Git"
3. Selecciona el repo → configuración de build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. En el panel de *Custom domains* añade `landedlabs.com/calculadoraproyectos` (o el subdirectorio que quieras usar dentro de tu dominio). Sigue los pasos de Cloudflare para verificar el DNS y asignar el certificado.
5. Crea una regla de redirección (Bulk Redirect o Page Rules) que apunte `https://costcalc-a7k.pages.dev` hacia `https://landedlabs.com/calculadoraproyectos` para que la única URL pública sea la del dominio propio.

Alternativamente con Wrangler CLI (sin instalar global):
```bash
npm install
npm run cf:project:create  # solo la primera vez
npm run cf:deploy
```

Si prefieres hacerlo manual con `wrangler`:
```bash
npx wrangler login
npx wrangler pages project create costcalc --production-branch main
npx wrangler pages deploy dist --project-name costcalc
```

## Estructura

```
src/
├── data/
│   ├── roles.js       # Salarios mercado MX 2025
│   ├── infra.js       # AWS, Cloudflare, DO, PaaS, serverless, R2...
│   ├── stack.js       # SaaS, herramientas, pagos MX, facturación SAT...
│   └── ai.js          # OpenAI, Anthropic, Google, vector DBs, voz, imagen...
├── App.jsx            # App principal
├── main.jsx
└── index.css
```

## Actualizar precios

Los precios están en los archivos `src/data/*.js`. Cada objeto tiene:
- `usd`: precio mensual en USD
- `note`: descripción / aclaración
- Para LLMs: `inputPer1M` y `outputPer1M` en USD por millón de tokens

## Variables incluidas

### Capital Humano (32 roles)
Salarios MXN con rangos Junior/Mid/Senior. Opción de incluir carga social (IMSS, INFONAVIT, prestaciones ~30%).

### Infraestructura
AWS EC2/RDS/S3/Lambda/API GW/SQS/SNS · Cloudflare R2/Workers/D1/KV/Queues/Pages · DigitalOcean · Vercel/Railway/Render/Fly.io · Supabase/PlanetScale/Neon/Turso/Upstash/MongoDB · Kafka/Pusher/Ably

### Stack & SaaS
GitHub/GitLab/CI-CD · Jira/Linear/Notion · Figma/Framer · Sentry/Datadog/New Relic · SendGrid/Resend/Twilio/Vonage/WhatsApp · Auth0/Clerk/Stytch · **Stripe/Conekta/Openpay/Clip/Mercado Pago/Kushki** · **Facturapi/SW SAPien/Finkok (CFDI SAT)** · Google Maps/Mapbox · Mixpanel/PostHog/Hotjar · Algolia/Typesense · HubSpot/Intercom/Zendesk

### Inteligencia Artificial
OpenAI (GPT-4o, o1, o3-mini, Whisper, DALL·E) · Anthropic (Claude Sonnet/Haiku/Opus) · Google (Gemini Flash/Pro/Ultra) · Groq/Together/Mistral · Pinecone/Weaviate/Qdrant · ElevenLabs/Deepgram/AssemblyAI · Stability/fal.ai/Replicate/Runway · Modal/Vast.ai · LangSmith/Helicone/Portkey
