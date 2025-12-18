# 🚂 Railway ile Hızlı Deployment

## Neden Railway?

✅ **Ücretsiz** PostgreSQL + Redis + Backend hosting
✅ **5 dakikada** canlıya alın
✅ **Otomatik** SSL ve domain
✅ **GitHub** ile entegre

---

## Adım 1: Projeyi GitHub'a Yükle

```bash
cd Qpratik

# Git init
git init
git add .
git commit -m "Initial commit: Qpratik platform"

# GitHub'da yeni repo oluştur (qpratik) sonra:
git remote add origin https://github.com/KULLANICI_ADIN/qpratik.git
git branch -M main
git push -u origin main
```

---

## Adım 2: Railway Hesabı Oluştur

1. [Railway.app](https://railway.app/) 'e git
2. "Start a New Project" → "Deploy from GitHub repo"
3. GitHub hesabını bağla
4. `qpratik` repository'yi seç

---

## Adım 3: Servisleri Ekle

Railway dashboard'da:

### PostgreSQL Ekle
1. "New" → "Database" → "PostgreSQL"
2. Otomatik `DATABASE_URL` oluşturulacak

### Redis Ekle
1. "New" → "Database" → "Redis"
2. Otomatik `REDIS_URL` oluşturulacak

### Backend Deploy Et
1. Repository zaten seçili
2. "Settings" → "Root Directory" → `backend` yaz
3. "Deploy"

---

## Adım 4: Environment Variables

Backend servisinde "Variables" sekmesine git ve ekle:

```
DATABASE_URL=(Railway otomatik ekleyecek)
REDIS_HOST=(Railway'den al)
REDIS_PORT=6379

JWT_SECRET=qpratik-railway-jwt-secret-min-32-chars-production-2024
JWT_REFRESH_SECRET=qpratik-railway-refresh-secret-min-32-chars-production-2024

FRONTEND_URL=https://qpratik.vercel.app
BACKEND_URL=(Railway backend URL'i buraya)

NODE_ENV=production
PORT=3001
```

**Opsiyonel servisler:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## Adım 5: Migrations Çalıştır

Railway dashboard'da backend servisine git:

1. "Settings" → "Deploy Triggers"
2. Ya da manuel: Railway CLI ile

```bash
# Railway CLI yükle
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

---

## Adım 6: Frontend'i Vercel'e Deploy Et

```bash
cd frontend

# Vercel CLI
npm i -g vercel

# Deploy
vercel

# .env.production ayarla
# VITE_API_URL=https://backend-url-from-railway.up.railway.app

# Production deploy
vercel --prod
```

---

## Adım 7: Domain Ayarla (Opsiyonel)

Railway ve Vercel'de custom domain ekle:
- Backend: `api.qpratik.com`
- Frontend: `qpratik.com`

SSL otomatik aktif!

---

## ✅ Tamamlandı!

Backend: https://your-backend.up.railway.app
Frontend: https://qpratik.vercel.app

Test et:
- Kayıt ol
- Login ol
- Özellikleri dene

---

## 💰 Maliyet

**Railway Free Tier:**
- $5 credit/ay
- 500 saat/ay

**Vercel Free Tier:**
- Unlimited
- 100GB bandwidth

Toplam: **$0-5/ay** (hobby projeler için yeterli)

Trafik artınca upgrade yapılabilir.

---

## 🔧 Update Yapmak

```bash
# Kod değiştir
git add .
git commit -m "Update: new feature"
git push

# Railway otomatik deploy eder!
```

---

**5 dakikada canlıda! 🚀**
