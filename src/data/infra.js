// Infraestructura cloud - costos de referencia USD/mes (Q1 2025)
// La mayoria son montos mensuales; dominios anuales prorrateados a mes.

export const INFRA = [
  // AWS · COMPUTO
  { id: "ec2_nano", label: "EC2 t3.nano", cat: "AWS · Computo", usd: 3.8, note: "0.5 GB RAM · dev/test" },
  { id: "ec2_micro", label: "EC2 t3.micro", cat: "AWS · Computo", usd: 7.59, note: "1 vCPU · 1 GB RAM" },
  { id: "ec2_small", label: "EC2 t3.small", cat: "AWS · Computo", usd: 15.18, note: "2 vCPU · 2 GB RAM" },
  { id: "ec2_medium", label: "EC2 t3.medium", cat: "AWS · Computo", usd: 30.37, note: "2 vCPU · 4 GB RAM" },
  { id: "ec2_large", label: "EC2 t3.large", cat: "AWS · Computo", usd: 60.74, note: "2 vCPU · 8 GB RAM" },
  { id: "ec2_xlarge", label: "EC2 t3.xlarge", cat: "AWS · Computo", usd: 121.47, note: "4 vCPU · 16 GB RAM" },
  { id: "ecs", label: "ECS Fargate", cat: "AWS · Computo", usd: 35, note: "0.5 vCPU / 1 GB 24/7 estimado" },

  // AWS · DATOS
  { id: "rds_micro", label: "RDS t3.micro", cat: "AWS · Base de Datos", usd: 24.82, note: "MySQL/PG · 1 vCPU · 1 GB" },
  { id: "rds_small", label: "RDS t3.small", cat: "AWS · Base de Datos", usd: 49.64, note: "MySQL/PG · 2 vCPU · 2 GB" },
  { id: "rds_medium", label: "RDS t3.medium", cat: "AWS · Base de Datos", usd: 99.28, note: "MySQL/PG · 2 vCPU · 4 GB" },
  { id: "dynamo", label: "DynamoDB On-Demand", cat: "AWS · Base de Datos", usd: 10, note: "Uso bajo · pago por request" },
  { id: "elasticache", label: "ElastiCache t3.micro", cat: "AWS · Base de Datos", usd: 24.82, note: "Redis cache" },

  // AWS · STORAGE / CDN
  { id: "s3_50", label: "S3 ~50 GB + ops", cat: "AWS · Storage", usd: 2, note: "Object storage" },
  { id: "s3_200", label: "S3 ~200 GB + ops", cat: "AWS · Storage", usd: 7.5, note: "Object storage" },
  { id: "cloudfront", label: "CloudFront 500 GB/mes", cat: "AWS · Storage", usd: 42.5, note: "CDN + transferencia" },

  // AWS · SERVERLESS
  { id: "lambda_sm", label: "Lambda bajo uso", cat: "AWS · Serverless", usd: 5, note: "~5M invocaciones/mes" },
  { id: "lambda_md", label: "Lambda uso medio", cat: "AWS · Serverless", usd: 20, note: "~20M invocaciones/mes" },
  { id: "apigw", label: "API Gateway REST", cat: "AWS · Serverless", usd: 10, note: "~10M llamadas/mes" },
  { id: "sqs", label: "SQS", cat: "AWS · Serverless", usd: 4, note: "~10M mensajes/mes" },
  { id: "sns", label: "SNS", cat: "AWS · Serverless", usd: 5, note: "~10M publicaciones" },

  // CLOUDFLARE
  { id: "cf_pro", label: "Cloudflare Pro", cat: "Cloudflare", usd: 20, note: "WAF · DDoS · CDN · SSL" },
  { id: "cf_workers", label: "Workers Paid", cat: "Cloudflare", usd: 5, note: "10M req/mes · edge serverless" },
  { id: "cf_r2", label: "R2 ~100 GB", cat: "Cloudflare", usd: 1.5, note: "Sin egress" },
  { id: "cf_r2_500", label: "R2 ~500 GB", cat: "Cloudflare", usd: 7.5, note: "Sin egress" },
  { id: "cf_kv", label: "Workers KV", cat: "Cloudflare", usd: 5, note: "KV distribuido" },
  { id: "cf_d1", label: "D1", cat: "Cloudflare", usd: 5, note: "SQLite edge" },
  { id: "cf_queues", label: "Queues", cat: "Cloudflare", usd: 0.4, note: "1M mensajes/mes" },
  { id: "cf_images", label: "Images", cat: "Cloudflare", usd: 5, note: "100k imagenes" },
  { id: "cf_stream", label: "Stream", cat: "Cloudflare", usd: 5, note: "Video almacenado" },
  { id: "cf_pages", label: "Pages Pro", cat: "Cloudflare", usd: 20, note: "Builds + analytics" },
  { id: "cf_domain_com", label: "Cloudflare Domains .com", cat: "Cloudflare · Dominios", usd: 0.85, note: "Costo anual prorrateado" },
  { id: "cf_domain_mx", label: "Cloudflare Domains .mx", cat: "Cloudflare · Dominios", usd: 2.7, note: "Costo anual prorrateado" },
  { id: "cf_domain_io", label: "Cloudflare Domains .io", cat: "Cloudflare · Dominios", usd: 3.25, note: "Costo anual prorrateado" },
  { id: "cf_domain_ssl", label: "SSL avanzado / ACM extra", cat: "Cloudflare · Dominios", usd: 5, note: "Si agregas certificados avanzados" },

  // DIGITALOCEAN
  { id: "do_1gb", label: "Droplet 1 GB", cat: "DigitalOcean", usd: 6, note: "1 vCPU · 25 GB SSD" },
  { id: "do_2gb", label: "Droplet 2 GB", cat: "DigitalOcean", usd: 12, note: "1 vCPU · 50 GB SSD" },
  { id: "do_4gb", label: "Droplet 4 GB", cat: "DigitalOcean", usd: 24, note: "2 vCPU · 80 GB SSD" },
  { id: "do_db", label: "Managed DB Basic", cat: "DigitalOcean", usd: 15, note: "PostgreSQL/MySQL basico" },
  { id: "do_spaces", label: "Spaces 250 GB", cat: "DigitalOcean", usd: 5, note: "Storage + CDN" },
  { id: "do_k8s", label: "Kubernetes 1 nodo", cat: "DigitalOcean", usd: 24, note: "Managed K8s" },

  // PAAS
  { id: "vercel_pro", label: "Vercel Pro", cat: "PaaS", usd: 20, note: "Frontend + edge functions" },
  { id: "railway", label: "Railway Pro", cat: "PaaS", usd: 20, note: "Backend + creditos" },
  { id: "render_ind", label: "Render Individual", cat: "PaaS", usd: 7, note: "Web service + cron" },
  { id: "render_team", label: "Render Team", cat: "PaaS", usd: 25, note: "SLA + soporte" },
  { id: "fly_io", label: "Fly.io estimado", cat: "PaaS", usd: 20, note: "Apps cerca del usuario" },
  { id: "heroku_eco", label: "Heroku Eco", cat: "PaaS", usd: 5, note: "Backend simple" },
  { id: "heroku_basic", label: "Heroku Basic", cat: "PaaS", usd: 7, note: "Sin sleep" },

  // DB SERVERLESS / EDGE
  { id: "supabase_pro", label: "Supabase Pro", cat: "DB Serverless", usd: 25, note: "PG · Auth · Storage" },
  { id: "planetscale", label: "PlanetScale Scaler", cat: "DB Serverless", usd: 39, note: "MySQL serverless" },
  { id: "neon", label: "Neon Pro", cat: "DB Serverless", usd: 19, note: "PG autoscaling" },
  { id: "turso", label: "Turso Starter", cat: "DB Serverless", usd: 9, note: "SQLite distribuido" },
  { id: "upstash_redis", label: "Upstash Redis Pro", cat: "DB Serverless", usd: 10, note: "Redis serverless" },
  { id: "upstash_kafka", label: "Upstash Kafka", cat: "DB Serverless", usd: 10, note: "Kafka serverless" },
  { id: "mongodb_flex", label: "MongoDB Atlas Flex", cat: "DB Serverless", usd: 20, note: "Serverless uso medio" },
  { id: "cockroachdb", label: "CockroachDB Serverless", cat: "DB Serverless", usd: 15, note: "Distributed SQL" },

  // MENSAJERIA
  { id: "kafka_conf", label: "Confluent Kafka Basic", cat: "Mensajeria", usd: 65, note: "1 cluster" },
  { id: "pusher", label: "Pusher Channels 500k", cat: "Mensajeria", usd: 49, note: "Realtime" },
  { id: "ably", label: "Ably Pro", cat: "Mensajeria", usd: 29, note: "Pub/Sub realtime" },

  // OBSERVABILIDAD
  { id: "grafana", label: "Grafana Cloud Pro", cat: "Observabilidad", usd: 29, note: "Metricas · logs · trazas" },
  { id: "betterstack", label: "Better Stack Logs", cat: "Observabilidad", usd: 25, note: "Logs + uptime" },
  { id: "logtail", label: "Logtail", cat: "Observabilidad", usd: 30, note: "Logs estructurados" },

  // GOOGLE CLOUD
  { id: "gcr", label: "Cloud Run estimado", cat: "Google Cloud", usd: 15, note: "Contenedores serverless" },
  { id: "gcf_sm", label: "Cloud Functions bajo uso", cat: "Google Cloud", usd: 5, note: "~5M invocaciones/mes" },
  { id: "gcf_md", label: "Cloud Functions uso medio", cat: "Google Cloud", usd: 20, note: "~20M invocaciones/mes" },
  { id: "firestore", label: "Firestore estimado", cat: "Google Cloud", usd: 18, note: "Lecturas + escrituras + storage" },
  { id: "gcs_100", label: "Cloud Storage 100 GB", cat: "Google Cloud", usd: 2.3, note: "Object storage" },
];

export const INFRA_CATS = [...new Set(INFRA.map((item) => item.cat))];
