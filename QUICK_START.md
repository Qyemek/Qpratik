# 🚀 Qpratik - Quick Start Guide

## Canlıya Alma Adımları

### 1️⃣ Hazırlık

```bash
cd Qpratik

# Backend .env oluştur
cd backend
cp .env.example .env
```

`.env` dosyasını düzenle - **MİNİMUM GEREKLİ:**

```env
# Database (Local test için)
DATABASE_URL="postgresql://qpratik_user:qpratik_password_2024@localhost:5432/qpratik?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT - Güçlü secretlar üret!
JWT_SECRET=super-secret-minimum-32-characters-long-jwt-key-change-this
JWT_REFRESH_SECRET=super-secret-minimum-32-chars-refresh-key-change-this

# Email - Gmail kullanıyorsanız:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Opsiyonel (şimdilik boş bırakılabilir):
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
```

### 2️⃣ Docker ile Veritabanlarını Başlat

```bash
# Qpratik klasöründe
docker-compose up -d postgres redis
```

### 3️⃣ Backend Kurulum

```bash
cd backend

# Dependencies zaten yüklüyse atla
npm install

# Prisma setup
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Bu adımda admin kullanıcı ve örnek veriler oluşturulacak:
- Admin: `admin@qpratik.com` / `Admin123!`

### 4️⃣ Backend Başlat

```bash
# backend klasöründe
npm run start:dev
```

Backend şu adreste çalışacak: http://localhost:3001

### 5️⃣ Frontend Başlat (Yeni Terminal)

```bash
cd frontend

# Dependencies zaten yüklüyse atla
npm install

# Start
npm run dev
```

Frontend şu adreste çalışacak: http://localhost:3000

### ✅ Test Et!

1. http://localhost:3000 'e git
2. Admin ile giriş yap: `admin@qpratik.com` / `Admin123!`
3. Dashboard'u gör
4. Yeni kullanıcı kayıt yap ve test et

---

## 🌍 Production Deployment Seçenekleri

### Seçenek 1: Railway (En Kolay - Full Stack)

**Backend + Database + Redis:**

1. [Railway.app](https://railway.app)'e git, GitHub hesabınla giriş yap
2. "New Project" → "Deploy from GitHub repo"
3. Qpratik repository'yi seç
4. "Add PostgreSQL" servisini ekle
5. "Add Redis" servisini ekle
6. Environment variables ekle (Railway dashboard'dan)
7. Deploy!

**Frontend:**
Vercel'e deploy et (aşağıda)

### Seçenek 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend

# Vercel CLI yükle
npm i -g vercel

# Deploy
vercel --prod
```

**Backend (Railway):**
Yukarıdaki Railway adımlarını takip et.

### Seçenek 3: Full Docker (Kendi Sunucun)

VPS/Cloud sunucunda (DigitalOcean, AWS, Azure, etc.):

```bash
# Sunucuya bağlan
ssh user@your-server-ip

# Docker yükle
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Projeyi klonla
git clone https://github.com/yourusername/qpratik.git
cd qpratik

# Production .env ayarla
nano backend/.env

# Build ve başlat
docker-compose -f docker-compose.yml up -d --build

# Migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

Domain'i sunucu IP'sine yönlendir, SSL için Let's Encrypt kullan.

---

## 🔧 Gerekli Dış Servisler (Production için)

### 1. Google OAuth (Opsiyonel)

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Yeni proje oluştur
3. "APIs & Services" → "Credentials"
4. "Create Credentials" → "OAuth 2.0 Client ID"
5. Authorized redirect URIs ekle:
   - Dev: `http://localhost:3001/api/auth/google/callback`
   - Prod: `https://api.yourdomain.com/api/auth/google/callback`

### 2. OpenAI (AI Tutor için)

1. [OpenAI Platform](https://platform.openai.com/)
2. API Key oluştur
3. `.env`'e ekle: `OPENAI_API_KEY=sk-...`

### 3. Stripe (Ödeme için)

1. [Stripe Dashboard](https://dashboard.stripe.com/)
2. "Developers" → "API Keys"
3. Test keys al (şimdilik)
4. `.env`'e ekle

### 4. Email (Gmail)

1. Gmail hesabında 2FA aktif et
2. [App Passwords](https://myaccount.google.com/apppasswords) oluştur
3. `.env`'e ekle

---

## 🎯 Production Checklist

Canlıya almadan önce:

- [ ] JWT secrets değiştirildi (32+ karakter)
- [ ] Database production ortamında
- [ ] Redis production ortamında
- [ ] CORS doğru domain'e ayarlandı
- [ ] Email SMTP çalışıyor
- [ ] HTTPS aktif (SSL)
- [ ] Environment variables güvende
- [ ] Database backup sistemi kuruldu
- [ ] Rate limiting aktif
- [ ] Admin şifresi değiştirildi

---

## 📱 Mobil Uygulama (Median.co)

Web uygulaması canlıya alındıktan sonra:

1. [Median.co](https://median.co)'ya git
2. "Create New App"
3. Web URL'ini gir (https://yourdomain.com)
4. Permissions: Camera, Microphone (on-demand)
5. Push notifications aktif et
6. Build ve stores'a yükle (App Store, Play Store)

---

## ❓ Sorun mu var?

**Database bağlanamıyor:**
- Docker container'lar çalışıyor mu? `docker ps`
- Connection string doğru mu?

**Migrations hata veriyor:**
- `npx prisma generate` çalıştır
- Database boş mu kontrol et

**Frontend backend'e bağlanamıyor:**
- Backend çalışıyor mu? http://localhost:3001/api
- CORS ayarları doğru mu?

**Port zaten kullanımda:**
- `.env` dosyasında PORT değiştir
- Veya kullanılan uygulamayı kapat

---

## 🎉 Hazır!

Artık Qpratik canlıda!

Kullanıcılar:
- ✅ Kayıt olabilir
- ✅ İçerik öğrenebilir
- ✅ Test çözebilir
- ✅ Arkadaş ekleyebilir
- ✅ Sohbet edebilir
- ✅ Video görüşme yapabilir (WebRTC)
- ✅ AI ile pratik yapabilir
- ✅ Premium üye olabilir (Stripe)

**Demo kullanıcı hesabı oluşturup test edin!** 🚀
