# Qpratik - Deployment Guide

## Quick Start (Development)

### 1. Prerequisites
```bash
# Check versions
node --version  # Should be >= 18
npm --version   # Should be >= 9
docker --version
docker-compose --version
```

### 2. Clone and Setup
```bash
cd Qpratik

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
# Database (Docker will use these)
DATABASE_URL="postgresql://qpratik_user:qpratik_password_2024@localhost:5432/qpratik?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (Generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=Qpratik <noreply@qpratik.com>

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# OpenAI (Get from OpenAI)
OPENAI_API_KEY=sk-...your-openai-api-key

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Server
PORT=3001
NODE_ENV=development
```

### 4. Start with Docker
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait a few seconds for databases to initialize
sleep 5

# Run migrations and seed
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ..

# Start backend and frontend
npm run dev
```

This will start:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

### 5. Access the Application

**Frontend:** http://localhost:3000
**Admin Login:**
- Email: `admin@qpratik.com`
- Password: `Admin123!`

---

## Production Deployment

### Option 1: Full Docker Deployment

1. **Configure production environment:**

```bash
# Update backend/.env for production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@postgres:5432/qpratik
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
# ... other production values
```

2. **Build and start:**

```bash
docker-compose build
docker-compose up -d
```

3. **Run migrations:**

```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

4. **Setup Nginx SSL:**

Edit `nginx/nginx.conf` to add SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... rest of configuration
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Place SSL certificates in `nginx/ssl/`.

### Option 2: Manual Deployment

#### Backend

```bash
cd backend

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Seed database (first time only)
npx prisma db seed

# Start
npm run start:prod
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Build
npm run build

# Serve with Nginx or any static hosting
# Build output is in frontend/dist/
```

### Option 3: Cloud Platforms

#### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
cd backend
# Add Procfile:
echo "web: npm run start:prod" > Procfile
git push heroku main
```

#### Database: Use managed PostgreSQL (Supabase, Railway, etc.)
#### Redis: Use managed Redis (Upstash, Redis Cloud, etc.)

---

## Environment-Specific Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3001/api/auth/google/callback`
   - Production: `https://api.yourdomain.com/api/auth/google/callback`

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers section
3. Create products for subscriptions
4. Setup webhook endpoint:
   - URL: `https://api.yourdomain.com/api/payment/webhook`
   - Events: `checkout.session.completed`

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to `.env` as `OPENAI_API_KEY`

### Email (Gmail) Setup

1. Enable 2-Factor Authentication on Google Account
2. Generate App Password
3. Use App Password in `SMTP_PASSWORD`

---

## Database Migrations

### Create new migration:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Deploy to production:
```bash
npx prisma migrate deploy
```

### Reset database (DEV ONLY):
```bash
npx prisma migrate reset
```

---

## Monitoring & Logs

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Check status:
```bash
docker-compose ps
```

---

## Backup & Restore

### Backup PostgreSQL:
```bash
docker-compose exec postgres pg_dump -U qpratik_user qpratik > backup.sql
```

### Restore PostgreSQL:
```bash
docker-compose exec -T postgres psql -U qpratik_user qpratik < backup.sql
```

---

## Scaling

### Horizontal Scaling:
- Use load balancer in front of multiple backend instances
- Share Redis instance across instances
- Use managed PostgreSQL with read replicas

### Vertical Scaling:
Edit `docker-compose.yml`:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 4G
```

---

## Troubleshooting

### Backend won't start:
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready: Wait a few seconds
# 2. Migrations not run: Run npx prisma migrate deploy
# 3. Port already in use: Change PORT in .env
```

### Frontend build fails:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket not connecting:
- Check CORS settings in backend
- Verify Nginx proxy configuration for `/socket.io`

### File uploads failing:
- Check `MAX_FILE_SIZE` in .env
- Verify `uploads/` directory exists and is writable
- Check Nginx `client_max_body_size`

---

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets (never commit .env)

---

## Performance Optimization

1. **Redis Caching:**
   - User sessions
   - Online status
   - Matching queue

2. **Database:**
   - Indexes on frequently queried fields
   - Connection pooling

3. **Frontend:**
   - Code splitting
   - Lazy loading
   - Image optimization

4. **CDN:**
   - Serve static assets via CDN
   - Use Cloudflare or similar

---

## Support

For issues, check:
1. This guide
2. `README.md`
3. Backend logs: `docker-compose logs backend`
4. PostgreSQL logs: `docker-compose logs postgres`

---

**Ready to launch! 🚀**
