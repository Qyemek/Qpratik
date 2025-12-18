# 🎯 CANLIYA ALIM REHBERİ

## Hızlı Başlangıç - 3 Seçenek

---

## ⚡ SEÇENEK 1: Railway (En Kolay - Önerilen)

### 1. GitHub'a Yükle

```bash
cd Qpratik
git init
git add .
git commit -m "Initial commit"

# GitHub'da 'qpratik' repo oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADIN/qpratik.git
git push -u origin main
```

### 2. Railway'e Deploy

1. **[Railway.app](https://railway.app/)** → GitHub ile giriş
2. **"New Project"** → "Deploy from GitHub repo" → `qpratik` seç
3. **PostgreSQL ekle:** "New" → "Database" → "PostgreSQL"
4. **Redis ekle:** "New" → "Database" → "Redis"
5. **Backend settings:**
   - Root Directory: `backend`
   - Start Command: `npm run start:prod`

### 3. Environment Variables Ekle

Backend servisinde "Variables":

```
DATABASE_URL=(otomatik gelecek)
REDIS_HOST=(Redis URL'den al)
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-32-char-refresh-secret
FRONTEND_URL=https://qpratik.vercel.app
NODE_ENV=production
PORT=3001
```

### 4. Migrations

```bash
npm i -g @railway/cli
railway login
railway link (projeyi seç)
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### 5. Frontend Deploy (Vercel)

```bash
cd frontend
npm i -g vercel

# .env.local oluştur
echo "VITE_API_URL=https://your-backend.railway.app" > .env.local

vercel --prod
```

**✅ Bitti! Backend + Frontend canlıda!**

---

## 🐳 SEÇENEK 2: Docker (Kendi Sunucu)

VPS/Cloud sunucunda (DigitalOcean, AWS, etc.):

```bash
# Docker yükle
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Projeyi indir
git clone https://github.com/yourusername/qpratik.git
cd qpratik

# .env ayarla
nano backend/.env

# Başlat
docker-compose up -d --build

# Migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

Domain IP'ye yönlendir, SSL için Certbot kullan.

---

## 💻 SEÇENEK 3: Local Test (Development)

Docker kuruluysa:

```bash
cd Qpratik

# Database başlat
docker-compose up -d postgres redis

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend (yeni terminal)
cd frontend
npm install
npm run dev
```

**Uygulama:** http://localhost:3000
**Admin:** admin@qpratik.com / Admin123!

---

## 📋 Production Checklist

Canlıya almadan önce:

- [ ] `.env` dosyasında güçlü secretlar (32+ karakter)
- [ ] CORS doğru domain'e ayarlandı
- [ ] JWT secret değiştirildi
- [ ] Database production ortamında
- [ ] HTTPS aktif (SSL)
- [ ] Admin şifresi değiştirildi
- [ ] Email SMTP çalışıyor
- [ ] Rate limiting aktif

---

## 🔑 Gerekli API Keys (Opsiyonel)

### Google OAuth
[Google Cloud Console](https://console.cloud.google.com/) → Credentials → OAuth 2.0

### OpenAI (AI Tutor)
[OpenAI Platform](https://platform.openai.com/) → API Keys

### Stripe (Payments)
[Stripe Dashboard](https://dashboard.stripe.com/) → Developers → API Keys

### Email (Gmail App Password)
[Google Account](https://myaccount.google.com/apppasswords) → App passwords

---

## 🚨 Sorun Giderme

**Database bağlanamıyor:**
- Connection string doğru mu?
- Database çalışıyor mu?

**Migrations hata veriyor:**
```bash
npx prisma generate
npx prisma migrate reset (DEV ONLY!)
```

**Frontend backend'e bağlanamıyor:**
- CORS ayarları kontrol et
- Backend URL'i doğru mu?

**Port kullanımda:**
- .env'de PORT değiştir

---

## 📱 Mobil Uygulama (Sonrası)

Web canlıda olduktan sonra:

1. [Median.co](https://median.co) → "Create New App"
2. Web URL gir
3. Permissions: Camera, Microphone
4. Build → App Store & Play Store

---

## 🎉 Tamamlandı!

Artık Qpratik canlıda!

**Test:**
- Yeni kullanıcı kayıt et
- İçerik öğren
- Test çöz
- Arkadaş ekle
- Sohbet et
- Video görüş (WebRTC)
- AI Tutor dene

**Destek:**
- README.md
- DEPLOYMENT_GUIDE.md
- QUICK_START.md

---

**Başarılar! 🚀**

*İlk kullanıcılara kampanya yapmayı unutma!*
