// IA / ML - costos de referencia USD (Q1 2025)
// billing:
// - tokens: por millon de tokens de entrada/salida
// - usage: por unidad consumida (imagen, minuto, hora GPU, modelo entrenado, etc.)
// - monthly: cargo mensual fijo o escenario mensual estimado

export const AI_PROVIDERS = [
  // OPENAI
  { id: "gpt4o", label: "GPT-4o", cat: "OpenAI · LLM", billing: "tokens", inputPer1M: 2.5, outputPer1M: 10, note: "Uso general multimodal" },
  { id: "gpt4o_mini", label: "GPT-4o mini", cat: "OpenAI · LLM", billing: "tokens", inputPer1M: 0.15, outputPer1M: 0.6, note: "Costo/perf alto" },
  { id: "o1", label: "o1", cat: "OpenAI · LLM", billing: "tokens", inputPer1M: 15, outputPer1M: 60, note: "Razonamiento profundo" },
  { id: "o3_mini", label: "o3-mini", cat: "OpenAI · LLM", billing: "tokens", inputPer1M: 1.1, outputPer1M: 4.4, note: "Razonamiento eficiente" },
  { id: "gpt4_turbo", label: "GPT-4 Turbo", cat: "OpenAI · LLM", billing: "tokens", inputPer1M: 10, outputPer1M: 30, note: "Contexto largo" },
  { id: "oai_embed_large", label: "Embeddings text-3-large", cat: "OpenAI · Embeddings", billing: "tokens", inputPer1M: 0.13, outputPer1M: 0, note: "3072 dims" },
  { id: "oai_embed_small", label: "Embeddings text-3-small", cat: "OpenAI · Embeddings", billing: "tokens", inputPer1M: 0.02, outputPer1M: 0, note: "1536 dims" },
  { id: "whisper", label: "Whisper STT", cat: "OpenAI · Audio", billing: "usage", rateUSD: 0.006, unitLabel: "min", defaultUnits: 1000, note: "USD por minuto" },
  { id: "tts_hd", label: "TTS HD", cat: "OpenAI · Audio", billing: "usage", rateUSD: 0.03, unitLabel: "1k chars", defaultUnits: 100, note: "USD por 1k caracteres" },
  { id: "dalle3", label: "DALL-E 3", cat: "OpenAI · Imagen", billing: "usage", rateUSD: 0.04, unitLabel: "imagen", defaultUnits: 200, note: "1024 px" },

  // ANTHROPIC
  { id: "claude_opus", label: "Claude Opus 4", cat: "Anthropic · LLM", billing: "tokens", inputPer1M: 15, outputPer1M: 75, note: "Maxima capacidad" },
  { id: "claude_sonnet", label: "Claude Sonnet 3.7", cat: "Anthropic · LLM", billing: "tokens", inputPer1M: 3, outputPer1M: 15, note: "Balance costo/perf" },
  { id: "claude_haiku", label: "Claude Haiku 3.5", cat: "Anthropic · LLM", billing: "tokens", inputPer1M: 0.8, outputPer1M: 4, note: "Rapido y economico" },

  // GOOGLE
  { id: "gemini_flash", label: "Gemini 2.0 Flash", cat: "Google · LLM", billing: "tokens", inputPer1M: 0.1, outputPer1M: 0.4, note: "Respuesta barata" },
  { id: "gemini_pro", label: "Gemini 2.0 Pro", cat: "Google · LLM", billing: "tokens", inputPer1M: 1.25, outputPer1M: 5, note: "Multimodal" },
  { id: "gemini_ultra", label: "Gemini Ultra", cat: "Google · LLM", billing: "tokens", inputPer1M: 7, outputPer1M: 21, note: "Top tier" },
  { id: "vertex_embed", label: "Vertex AI Embeddings", cat: "Google · Embeddings", billing: "monthly", monthlyUSD: 0, note: "Puede iniciar gratis" },

  // OSS HOSTED
  { id: "llama3_groq", label: "Llama 3.1 70B via Groq", cat: "OSS Hosted", billing: "tokens", inputPer1M: 0.59, outputPer1M: 0.79, note: "Muy baja latencia" },
  { id: "llama3_together", label: "Llama 3.1 405B via Together", cat: "OSS Hosted", billing: "tokens", inputPer1M: 3.5, outputPer1M: 3.5, note: "Open weights de gran tamano" },
  { id: "mistral_large", label: "Mistral Large API", cat: "OSS Hosted", billing: "tokens", inputPer1M: 2, outputPer1M: 6, note: "Proveedor europeo" },
  { id: "mixtral", label: "Mixtral 8x7B", cat: "OSS Hosted", billing: "tokens", inputPer1M: 0.6, outputPer1M: 0.6, note: "MoE eficiente" },

  // VECTOR DB
  { id: "pinecone", label: "Pinecone Serverless", cat: "Vector DB", billing: "monthly", monthlyUSD: 70, note: "1M vectores + queries" },
  { id: "weaviate", label: "Weaviate Cloud", cat: "Vector DB", billing: "monthly", monthlyUSD: 25, note: "Escenario mediano" },
  { id: "qdrant", label: "Qdrant Cloud", cat: "Vector DB", billing: "monthly", monthlyUSD: 25, note: "Open source" },
  { id: "chroma_cloud", label: "Chroma Cloud", cat: "Vector DB", billing: "monthly", monthlyUSD: 20, note: "Escenario base" },

  // AI OPS
  { id: "langsmith", label: "LangSmith Plus", cat: "AI Ops", billing: "monthly", monthlyUSD: 39, note: "Trazas + evaluaciones" },
  { id: "helicone", label: "Helicone Pro", cat: "AI Ops", billing: "monthly", monthlyUSD: 20, note: "Proxy + analytics" },
  { id: "portkey", label: "Portkey Production", cat: "AI Ops", billing: "monthly", monthlyUSD: 49, note: "Gateway multi-modelo" },

  // IMAGEN / VIDEO
  { id: "stability", label: "Stability AI", cat: "Imagen / Video", billing: "usage", rateUSD: 0.04, unitLabel: "imagen", defaultUnits: 500, note: "Generacion imagen" },
  { id: "fal_ai", label: "fal.ai FLUX", cat: "Imagen / Video", billing: "usage", rateUSD: 0.05, unitLabel: "imagen", defaultUnits: 500, note: "Inference FLUX" },
  { id: "replicate", label: "Replicate GPU inference", cat: "Imagen / Video", billing: "monthly", monthlyUSD: 50, note: "Escenario mensual" },
  { id: "runwayml", label: "Runway Gen-3", cat: "Imagen / Video", billing: "monthly", monthlyUSD: 95, note: "Video AI" },

  // VOZ
  { id: "elevenlabs", label: "ElevenLabs Starter", cat: "Voz / Audio", billing: "monthly", monthlyUSD: 5, note: "30k chars" },
  { id: "elevenlabs_cr", label: "ElevenLabs Creator", cat: "Voz / Audio", billing: "monthly", monthlyUSD: 22, note: "100k chars" },
  { id: "deepgram", label: "Deepgram", cat: "Voz / Audio", billing: "usage", rateUSD: 0.004, unitLabel: "min", defaultUnits: 2000, note: "Transcripcion" },
  { id: "assemblyai", label: "AssemblyAI", cat: "Voz / Audio", billing: "usage", rateUSD: 0.037, unitLabel: "min", defaultUnits: 800, note: "STT async" },

  // FINE-TUNE / OSS PROPIO
  { id: "modal", label: "Modal GPU cloud", cat: "Fine-tune / OSS propio", billing: "usage", rateUSD: 4, unitLabel: "hora GPU", defaultUnits: 10, note: "A100/H100 serverless" },
  { id: "vast_ai", label: "Vast.ai A100", cat: "Fine-tune / OSS propio", billing: "usage", rateUSD: 2.7, unitLabel: "hora GPU", defaultUnits: 30, note: "Renta GPU" },
  { id: "together_fine", label: "Together AI fine-tuning", cat: "Fine-tune / OSS propio", billing: "monthly", monthlyUSD: 50, note: "Fine-tune + serving" },
  { id: "ollama_cpu", label: "Ollama self-host CPU", cat: "Fine-tune / OSS propio", billing: "monthly", monthlyUSD: 18, note: "Demo local ligera" },
  { id: "ollama_gpu", label: "Ollama self-host GPU", cat: "Fine-tune / OSS propio", billing: "monthly", monthlyUSD: 120, note: "Llama / Qwen 14B+ en produccion" },
  { id: "lora_llm", label: "Fine-tune LoRA LLM pequeno", cat: "Fine-tune / OSS propio", billing: "usage", rateUSD: 3.5, unitLabel: "hora GPU", defaultUnits: 24, note: "SFT / adaptacion" },

  // COMPUTER VISION
  { id: "yolo_train", label: "YOLO entrenamiento", cat: "Computer Vision", billing: "usage", rateUSD: 2.5, unitLabel: "hora GPU", defaultUnits: 40, note: "Dataset mediano" },
  { id: "yolo_infer", label: "YOLO inferencia productiva", cat: "Computer Vision", billing: "monthly", monthlyUSD: 65, note: "1 GPU ligera / edge VM" },
  { id: "cv_annotation", label: "Etiquetado vision", cat: "Computer Vision", billing: "usage", rateUSD: 0.08, unitLabel: "imagen", defaultUnits: 3000, note: "Etiquetado manual asistido" },

  // 3D
  { id: "sdf_3d", label: "Generacion 3D / Trellis", cat: "3D / Generative", billing: "usage", rateUSD: 3.2, unitLabel: "hora GPU", defaultUnits: 25, note: "Reconstruccion o generacion 3D" },
  { id: "gaussian_splat", label: "Gaussian Splatting", cat: "3D / Generative", billing: "usage", rateUSD: 2.8, unitLabel: "hora GPU", defaultUnits: 20, note: "Escenas fotogrametricas" },
  { id: "blender_ai", label: "Pipeline Blender + IA", cat: "3D / Generative", billing: "monthly", monthlyUSD: 45, note: "Automatizacion y renders base" },
];

export const AI_CATS = [...new Set(AI_PROVIDERS.map((item) => item.cat))];
