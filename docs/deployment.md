# Production Deployment & Infrastructure Guide

## Deployment Architecture

The application can be deployed to standalone Linux/Unix servers, containerized platforms (Docker, Kubernetes), or modern edge platforms (Vercel, AWS ECS, GCP Cloud Run).

### 1. Environment Configuration
Ensure `.env` contains production-strength secrets:
```bash
PORT=3000
NODE_ENV="production"
DATABASE_URL="postgresql://postgres:password@db-cluster.internal:5432/university_erp?schema=public"
JWT_SECRET="<generate-minimum-64-character-entropy-secret>"
PAYMENT_SANDBOX_KEY="<production-sandbox-merchant-key>"
```

### 2. PostgreSQL with Docker
Start the production database container using the included `docker-compose.yml`:
```bash
docker compose up -d
```

### 3. Database Migration
```bash
npx prisma migrate deploy
npm run prisma:seed
```

### 4. Build & Service Launch
```bash
npm run build
npm start
```

### 5. Reverse Proxy (Nginx / Caddy)
Configure SSL termination with automated Let's Encrypt certificates forwarding port 443 to `localhost:3000`. Set `X-Forwarded-For` and `X-Forwarded-Proto` headers.
