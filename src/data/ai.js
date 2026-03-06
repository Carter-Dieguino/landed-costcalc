// Costos de IA — precios USD (marzo 2025)
// LLMs: precio por millón de tokens (input / output)
// Otros: tarifa fija mensual estimada o precio por unidad

export const AI_PROVIDERS = [
  // ─── OPENAI ───────────────────────────────────────────────────
  { id: "gpt4o",          label: "GPT-4o",                    cat: "OpenAI · LLM",     inputPer1M: 2.50,  outputPer1M: 10.00, flatUSD: null, note: "" },
  { id: "gpt4o_mini",     label: "GPT-4o mini",              cat: "OpenAI · LLM",     inputPer1M: 0.15,  outputPer1M: 0.60,  flatUSD: null, note: "Mejor costo/perf bajo" },
  { id: "o1",             label: "o1 (razonamiento)",        cat: "OpenAI · LLM",     inputPer1M: 15.00, outputPer1M: 60.00, flatUSD: null, note: "Pensamiento largo" },
  { id: "o3_mini",        label: "o3-mini",                  cat: "OpenAI · LLM",     inputPer1M: 1.10,  outputPer1M: 4.40,  flatUSD: null, note: "Razonamiento eficiente" },
  { id: "gpt4_turbo",     label: "GPT-4 Turbo",              cat: "OpenAI · LLM",     inputPer1M: 10.00, outputPer1M: 30.00, flatUSD: null, note: "128k ctx" },
  { id: "oai_embed_large",label: "Embeddings text-3-large",  cat: "OpenAI · Embeddings",inputPer1M:0.13, outputPer1M: 0,     flatUSD: null, note: "3072 dims" },
  { id: "oai_embed_small",label: "Embeddings text-3-small",  cat: "OpenAI · Embeddings",inputPer1M:0.02, outputPer1M: 0,     flatUSD: null, note: "1536 dims · más barato" },
  { id: "whisper",        label: "Whisper STT",              cat: "OpenAI · Audio",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.006,note: "por minuto de audio" },
  { id: "tts_hd",         label: "TTS HD (voz)",             cat: "OpenAI · Audio",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 30.00,note: "$0.030/1k chars" },
  { id: "dalle3",         label: "DALL·E 3 (imágenes)",      cat: "OpenAI · Imagen",  inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.04, note: "$0.04 por imagen 1024px" },
  // ─── ANTHROPIC ────────────────────────────────────────────────
  { id: "claude_opus",    label: "Claude Opus 4",            cat: "Anthropic · LLM",  inputPer1M: 15.00, outputPer1M: 75.00, flatUSD: null, note: "Máxima capacidad" },
  { id: "claude_sonnet",  label: "Claude Sonnet 3.7",        cat: "Anthropic · LLM",  inputPer1M: 3.00,  outputPer1M: 15.00, flatUSD: null, note: "Balance costo/perf" },
  { id: "claude_haiku",   label: "Claude Haiku 3.5",         cat: "Anthropic · LLM",  inputPer1M: 0.80,  outputPer1M: 4.00,  flatUSD: null, note: "Ultrarrápido · barato" },
  // ─── GOOGLE ───────────────────────────────────────────────────
  { id: "gemini_flash",   label: "Gemini 2.0 Flash",         cat: "Google · LLM",     inputPer1M: 0.10,  outputPer1M: 0.40,  flatUSD: null, note: "Más económico de Google" },
  { id: "gemini_pro",     label: "Gemini 2.0 Pro",           cat: "Google · LLM",     inputPer1M: 1.25,  outputPer1M: 5.00,  flatUSD: null, note: "Multimodal completo" },
  { id: "gemini_ultra",   label: "Gemini Ultra",             cat: "Google · LLM",     inputPer1M: 7.00,  outputPer1M: 21.00, flatUSD: null, note: "Top tier Google" },
  { id: "vertex_embed",   label: "Vertex AI Embeddings",     cat: "Google · Embeddings",inputPer1M:0.00, outputPer1M: 0,     flatUSD: 0,   note: "Gratis hasta 1M tokens/mes" },
  // ─── META / OPEN SOURCE HOSTED ────────────────────────────────
  { id: "llama3_groq",    label: "Llama 3.1 70B (Groq)",    cat: "OSS Hosted",       inputPer1M: 0.59,  outputPer1M: 0.79,  flatUSD: null, note: "Velocidad extrema" },
  { id: "llama3_together",label: "Llama 3.1 405B (Together)",cat: "OSS Hosted",      inputPer1M: 3.50,  outputPer1M: 3.50,  flatUSD: null, note: "Modelo abierto más grande" },
  { id: "mistral_large",  label: "Mistral Large (API)",      cat: "OSS Hosted",       inputPer1M: 2.00,  outputPer1M: 6.00,  flatUSD: null, note: "EU-based · privacidad" },
  { id: "mixtral",        label: "Mixtral 8x7B (Together)",  cat: "OSS Hosted",       inputPer1M: 0.60,  outputPer1M: 0.60,  flatUSD: null, note: "MoE eficiente" },
  // ─── BASES DE DATOS VECTORIALES ───────────────────────────────
  { id: "pinecone",       label: "Pinecone Serverless",      cat: "Vector DB",        inputPer1M: 0,     outputPer1M: 0,     flatUSD: 70.00,note: "est. 1M vectores + queries" },
  { id: "weaviate",       label: "Weaviate Cloud",           cat: "Vector DB",        inputPer1M: 0,     outputPer1M: 0,     flatUSD: 25.00,note: "Sandbox 0, est. mediano" },
  { id: "qdrant",         label: "Qdrant Cloud",             cat: "Vector DB",        inputPer1M: 0,     outputPer1M: 0,     flatUSD: 25.00,note: "Open source · rápido" },
  { id: "chroma_cloud",   label: "Chroma Cloud (est.)",      cat: "Vector DB",        inputPer1M: 0,     outputPer1M: 0,     flatUSD: 20.00,note: "Open source · self-host posible" },
  // ─── ORQUESTACIÓN / AGENTES ───────────────────────────────────
  { id: "langsmith",      label: "LangSmith Plus",           cat: "AI Ops",           inputPer1M: 0,     outputPer1M: 0,     flatUSD: 39.00,note: "Trazas LLM · evaluación" },
  { id: "helicone",       label: "Helicone Pro",             cat: "AI Ops",           inputPer1M: 0,     outputPer1M: 0,     flatUSD: 20.00,note: "Proxy + analytics LLM" },
  { id: "portkey",        label: "Portkey Production",       cat: "AI Ops",           inputPer1M: 0,     outputPer1M: 0,     flatUSD: 49.00,note: "Gateway multi-LLM" },
  // ─── IMAGEN / VIDEO ─────────────────────────────────────────
  { id: "stability",      label: "Stability AI (img)",       cat: "Imagen / Video",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.04, note: "$0.04 por imagen" },
  { id: "fal_ai",         label: "fal.ai FLUX (img)",        cat: "Imagen / Video",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.05, note: "$0.05 por imagen FLUX.1" },
  { id: "replicate",      label: "Replicate GPU inference",  cat: "Imagen / Video",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 50.00,note: "est. 50 runs/mes" },
  { id: "runwayml",       label: "Runway Gen-3 (video)",     cat: "Imagen / Video",   inputPer1M: 0,     outputPer1M: 0,     flatUSD: 95.00,note: "625 créditos/mes · video AI" },
  // ─── VOZ / AUDIO ──────────────────────────────────────────────
  { id: "elevenlabs",     label: "ElevenLabs Starter",       cat: "Voz / Audio",      inputPer1M: 0,     outputPer1M: 0,     flatUSD: 5.00, note: "30k chars/mes · clonación voz" },
  { id: "elevenlabs_cr",  label: "ElevenLabs Creator",       cat: "Voz / Audio",      inputPer1M: 0,     outputPer1M: 0,     flatUSD: 22.00,note: "100k chars/mes" },
  { id: "deepgram",       label: "Deepgram Pay-as-you-go",   cat: "Voz / Audio",      inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.004,note: "$0.004/min transcripción" },
  { id: "assemblyai",     label: "AssemblyAI (STT)",         cat: "Voz / Audio",      inputPer1M: 0,     outputPer1M: 0,     flatUSD: 0.037,note: "$0.037/min · async" },
  // ─── FINE-TUNING / HOSTING PROPIO ─────────────────────────────
  { id: "modal",          label: "Modal (GPU cloud)",        cat: "GPU / Fine-tune",  inputPer1M: 0,     outputPer1M: 0,     flatUSD: 40.00,note: "A100/H100 serverless · est. 10h" },
  { id: "vast_ai",        label: "Vast.ai (A100 SXM)",       cat: "GPU / Fine-tune",  inputPer1M: 0,     outputPer1M: 0,     flatUSD: 80.00,note: "$2.70/hr · GPU rent est. 30h" },
  { id: "together_fine",  label: "Together AI Fine-tuning",  cat: "GPU / Fine-tune",  inputPer1M: 0,     outputPer1M: 0,     flatUSD: 50.00,note: "Fine-tune Llama + serving" },
];

export const AI_CATS = [...new Set(AI_PROVIDERS.map(a => a.cat))];
