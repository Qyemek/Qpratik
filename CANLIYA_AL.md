# 🚀 QPRATIK - CANLIYA ALMA KILAVUZU

## ✅ Hazırlık Tamamlandı!

- ✅ Tüm kod yazıldı (109 dosya)
- ✅ Git repository oluşturuldu
- ✅ Railway & Vercel CLI yüklendi
- ✅ Deployment scriptleri hazır
- ✅ Backend .env ayarlandı

---

## 🎯 HEMEN ŞİMDİ CANLIYA ALIN!

### Yöntem 1: Tek Komut (Otomatik) - Windows

```cmd
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"
deploy.bat
```

**Bu script:**
1. Railway login açar (tarayıcıda)
2. PostgreSQL + Redis ekler
3. Backend'i deploy eder
4. Migrations çalıştırır
5. Vercel login açar
6. Frontend'i deploy eder

**İŞLEM SÜRESİ: 10 dakika**

---

### Yöntem 2: Manuel Adımlar (Daha Kontrollü)

#### ADIM 1: Railway Backend Deploy

```bash
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"

# Railway login (tarayıcı açılacak)
railway login

# Proje oluştur
railway init
# İsim: qpratik-backend

# PostgreSQL ekle
railway add --database postgres

# Redis ekle
railway add --database redis

# Environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=qpratik-prod-secret-2024-min-32-chars
railway variables set JWT_REFRESH_SECRET=qpratik-prod-refresh-2024-min-32
railway variables set FRONTEND_URL=https://qpratik.vercel.app
railway variables set CORS_ORIGIN=https://qpratik.vercel.app

# Deploy!
cd backend
railway up

# Migrations
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

**Backend URL:** `https://qpratik-backend-xxx.up.railway.app`
**Bu URL'i not alın!**

#### ADIM 2: Vercel Frontend Deploy

```bash
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik\frontend"

# Backend URL'ini ekle
echo VITE_API_URL=https://qpratik-backend-xxx.up.railway.app > .env.production

# Vercel login (tarayıcı açılacak)
vercel login

# Deploy!
vercel --prod
```

**Frontend URL:** `https://qpratik.vercel.app`

#### ADIM 3: Backend CORS Güncelle

Railway dashboard → Backend service → Variables:

```
FRONTEND_URL=https://qpratik.vercel.app
CORS_ORIGIN=https://qpratik.vercel.app
```

Redeploy et!

---

### Yöntem 3: Railway Web Dashboard (En Kolay)

#### Backend:

1. **[Railway.app](https://railway.app/)** → GitHub ile giriş
2. "New Project" → "Empty Project"
3. "Add Service" → "Database" → "PostgreSQL"
4. "Add Service" → "Database" → "Redis"
5. "Add Service" → "GitHub Repo" → (önce repo oluştur)

**GitHub Repo Oluştur:**

```bash
# GitHub'da yeni repo: https://github.com/new
# Name: qpratik
# Public/Private

cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"
git remote add origin https://github.com/KULLANICI_ADIN/qpratik.git
git push -u origin main
```

Railway'e dön:
- GitHub repo'yu seç
- Root Directory: `backend`
- Variables ekle (yukarıdaki gibi)
- Deploy!

#### Frontend (Vercel):

1. **[Vercel.com](https://vercel.com/)** → GitHub ile giriş
2. "New Project"
3. "Import Git Repository" → `qpratik` seç
4. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: Railway backend URL
6. "Deploy"!

---

## 🎊 TAMAMLANDI!

**Uygulamanız canlıda:**
- Frontend: https://qpratik.vercel.app
- Backend: https://qpratik-backend-xxx.up.railway.app/api

**Test:**
1. Frontend'e git
2. Kayıt ol / Login ol
3. Dashboard'u gör
4. Özellikleri test et!

**Admin Login:**
- Email: `admin@qpratik.com`
- Şifre: `Admin123!`

---

## 📱 Bonus: Mobil Uygulama

Web canlıda olduktan sonra:

1. **[Median.co](https://median.co/)** → "Create App"
2. App Name: Qpratik
3. Website URL: `https://qpratik.vercel.app`
4. Icon & Splash screen ekle
5. Permissions: Camera, Microphone (on-demand)
6. Push notifications: Aktif
7. Build → iOS & Android
8. App Store & Play Store'a yükle!

**Süre:** 1-2 saat
**Maliyet:** Median free tier veya $19/ay

---

## 💰 Maliyet Özeti

**Railway:**
- Free: $5 credit/ay
- Hobby: $10/ay

**Vercel:**
- Free: Unlimited (hobby)
- Pro: $20/ay (gerekirse)

**Toplam:** $0-10/ay başlangıç

---

## 🔧 Güncelleme Yapmak

```bash
# Kod değiştir
git add .
git commit -m "Update: new feature"
git push

# Railway ve Vercel otomatik deploy eder!
```

---

## ❓ Sorun mu var?

**Railway login olmuyor:**
- `railway logout` sonra tekrar `railway login`

**Deploy hata veriyor:**
- Environment variables kontrol et
- Logs: `railway logs`

**Frontend backend'e bağlanamıyor:**
- CORS ayarını kontrol et
- Railway backend URL doğru mu?

**Database bağlantı hatası:**
- Railway PostgreSQL çalışıyor mu?
- DATABASE_URL doğru mu?

---

## 🎯 Şimdi Ne Yapmalısınız?

1. **deploy.bat** çalıştırın (Windows)
   VEYA
   Manuel adımları takip edin

2. Test edin

3. Kullanıcılarla paylaşın!

4. Sosyal medyada duyurun

5. Geri bildirim toplayın

6. Yeni özellikler ekleyin

---

**BAŞARILAR! 🚀**

*İlk 100 kullanıcıya özel kampanya yapmayı unutmayın!*
