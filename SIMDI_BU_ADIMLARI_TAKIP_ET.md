# ✅ GitHub'a Yükleme TAMAMLANDI!

**Repository URL:** https://github.com/Qyemek/Qpratik

---

# 🚀 ŞİMDİ RAILWAY'E DEPLOY ET (5 Dakika)

## ADIM 1: Railway'e Git

1. **[Railway.app](https://railway.app/)** aç
2. **"Login with GitHub"** tıkla
3. GitHub hesabınla giriş yap

---

## ADIM 2: Yeni Proje Oluştur

1. **"New Project"** tıkla
2. **"Deploy from GitHub repo"** seç
3. **"Configure GitHub App"** tıkla
4. **Qpratik** repository'yi seç ve izin ver
5. Railway'e dön, **Qpratik** repository'yi seç

---

## ADIM 3: PostgreSQL Ekle

1. Proje dashboard'da sağ üstte **"New"** tıkla
2. **"Database"** → **"Add PostgreSQL"** seç
3. Otomatik oluşturulacak, bekle...

---

## ADIM 4: Redis Ekle

1. Tekrar **"New"** tıkla
2. **"Database"** → **"Add Redis"** seç
3. Otomatik oluşturulacak, bekle...

---

## ADIM 5: Backend Service Ayarları

1. **"qpratik"** servisine (GitHub'dan gelen) tıkla
2. **"Settings"** sekmesine git
3. **"Root Directory"** bul → `backend` yaz
4. **"Deploy"** butonuna bas

---

## ADIM 6: Environment Variables Ekle

Backend servisinde **"Variables"** sekmesine git ve şunları ekle:

**Şunlar otomatik gelecek (dokunma):**
- `DATABASE_URL` (PostgreSQL'den otomatik)

**Manuel ekle:**

```
NODE_ENV=production
PORT=3001

JWT_SECRET=qpratik-railway-production-jwt-secret-2024-min-32-chars-long
JWT_REFRESH_SECRET=qpratik-railway-production-refresh-secret-min-32-chars

FRONTEND_URL=https://qpratik.vercel.app
CORS_ORIGIN=https://qpratik.vercel.app

REDIS_HOST=(Redis servisinden kopyala)
REDIS_PORT=6379
```

**REDIS_HOST nasıl bulunur:**
- Redis servisine tıkla
- "Connect" sekmesinde **HOST** değerini kopyala
- Örnek: `containers-us-west-123.railway.app`

**Opsiyonel (şimdilik boş bırak):**
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASSWORD=
```

**"Add"** butonuna bas!

---

## ADIM 7: Redeploy (Migrations için)

1. Backend servisine dön
2. **"Deployments"** sekmesi
3. En son deployment'a tıkla
4. Sağ üstte **"..."** → **"Redeploy"**

Deploy bitince backend hazır! ✅

---

## ADIM 8: Backend URL'ini Al

1. Backend servisinde **"Settings"** sekmesi
2. **"Domains"** bölümünde **"Generate Domain"** tıkla
3. URL oluşacak, örnek: `qpratik-production-abc123.up.railway.app`
4. **BU URL'İ NOT AL!** ⭐

---

# 🎨 FRONTEND'İ VERCEL'E DEPLOY ET (3 Dakika)

## ADIM 1: Vercel'e Git

1. **[Vercel.com](https://vercel.com/)** aç
2. **"Login"** → **"Continue with GitHub"**
3. GitHub hesabınla giriş yap

---

## ADIM 2: Proje İmport Et

1. **"New Project"** tıkla (veya "Add New..." → "Project")
2. **"Import Git Repository"** bölümünde **Qpratik** reposunu bul
3. **"Import"** tıkla

---

## ADIM 3: Ayarları Yap

**Framework Preset:** Vite (otomatik algılanacak)

**Root Directory:**
- **"Edit"** tıkla
- `frontend` yaz

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**

Şunu ekle:
```
VITE_API_URL = https://qpratik-production-abc123.up.railway.app
```
☝️ Railway'den aldığın backend URL'i buraya yapıştır!

---

## ADIM 4: Deploy Et!

**"Deploy"** butonuna bas!

2-3 dakika bekle...

**Tamamlandı!** ✅

Frontend URL'in: `https://qpratik-xyz.vercel.app`

---

# ✅ SON ADIM: Backend CORS Güncelle

Railway'e dön:

1. Backend servisi → **"Variables"**
2. Şu değişkenleri güncelle:

```
FRONTEND_URL = https://qpratik-xyz.vercel.app
CORS_ORIGIN = https://qpratik-xyz.vercel.app
```
☝️ Vercel'den aldığın frontend URL'i buraya yapıştır!

3. **"Redeploy"** et!

---

# 🎊 TAMAMLANDI!

**Uygulamanız canlıda!**

- 🌐 **Frontend:** https://qpratik-xyz.vercel.app
- 🔧 **Backend:** https://qpratik-production-abc123.up.railway.app/api
- 💾 **GitHub:** https://github.com/Qyemek/Qpratik

---

# 🧪 TEST ET!

1. Frontend URL'e git
2. **"Kayıt Ol"** tıkla
3. Yeni hesap oluştur
4. Login ol
5. Dashboard'u gör!

**Admin Login:**
- Email: `admin@qpratik.com`
- Şifre: `Admin123!`

---

# 📊 İSTATİSTİKLER

- ✅ Backend: Deployed
- ✅ Frontend: Deployed
- ✅ Database: PostgreSQL (Railway)
- ✅ Cache: Redis (Railway)
- ✅ SSL: Otomatik aktif

**Maliyet:** $0-5/ay (Railway free tier)

---

# 🔄 GÜNCELLEME YAPMAK

```bash
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"

# Kod değiştir
git add .
git commit -m "Update: yeni özellik"
git push

# Railway ve Vercel otomatik deploy eder!
```

---

# ❓ SORUN ÇÖZME

**Backend deploy olmadı?**
- Logs'a bak: Railway → Backend → "Deployments" → Log'lara tıkla
- `DATABASE_URL` var mı kontrol et

**Frontend backend'e bağlanamıyor?**
- `VITE_API_URL` doğru mu?
- CORS ayarları doğru mu?
- Backend çalışıyor mu?

**Database connection error?**
- Railway PostgreSQL çalışıyor mu?
- Variables'da `DATABASE_URL` var mı?

---

# 🚀 BAŞARILAR!

Uygulamanız şimdi canlıda!

İlk kullanıcılarınızla paylaşın! 🎉
