# 🎨 VERCEL FRONTEND DEPLOYMENT

## Çok Kolay! 3 Dakika ⏱️

### Adım 1: Vercel'e Git

1. **https://vercel.com/** aç
2. **"Sign Up"** veya **"Login"** tıkla
3. **"Continue with GitHub"** seç
4. GitHub hesabınla giriş yap (otomatik olacak)

✅ Vercel dashboard'dasınız!

---

### Adım 2: Yeni Proje Oluştur

1. **"Add New..."** tıkla (sağ üstte)
2. **"Project"** seç
3. **"Import Git Repository"** başlığı altında **Qpratik** reposunu bulun
4. **"Import"** tıkla

---

### Adım 3: Proje Ayarları

**Framework Preset:**
- Otomatik **"Vite"** seçilecek ✅

**Root Directory:**
1. **"Edit"** butonuna tıkla
2. **"frontend"** seç veya yaz
3. ✅ işareti görünecek

**Build and Output Settings:**
- Build Command: `npm run build` (otomatik dolu)
- Output Directory: `dist` (otomatik dolu)
- Install Command: `npm install` (otomatik dolu)

Değiştirmeyin, aynen bırakın! ✅

---

### Adım 4: Environment Variables Ekle

**ÇOK ÖNEMLİ!** Backend URL'ini eklemelisiniz.

1. **"Environment Variables"** bölümünü aç
2. Şunu ekle:

**Name:**
```
VITE_API_URL
```

**Value:**
```
https://qpratik-production-abc123.up.railway.app
```

☝️ **Railway'den aldığınız backend URL'i buraya yapıştırın!**

**Environment:** `Production` (default)

3. **"Add"** tıkla

---

### Adım 5: Deploy!

1. **"Deploy"** butonuna tıkla
2. Bekleyin... (2-3 dakika)
3. Konfeti 🎉 göreceksiniz!

✅ Frontend canlıda!

---

### Adım 6: Frontend URL'ini Al

Deploy bitince:

1. **"Visit"** butonuna tıkla VEYA
2. Dashboard'da gösterilen URL'i kopyala

**Frontend URL'iniz:** `https://qpratik-xyz.vercel.app`

**BU URL'İ NOT ALIN!** 📝

---

## 🔄 SON ADIM: Backend CORS Güncelle

**ÇOK ÖNEMLİ!** Backend'e frontend URL'ini söylemeliyiz.

### Railway'e Dön:

1. **https://railway.app/** → Projenize git
2. **"qpratik"** (backend) servisine tıkla
3. **"Variables"** sekmesi
4. Şu 2 değişkeni **GÜNCELLE** (ekle değil!):

**FRONTEND_URL:**
```
https://qpratik-xyz.vercel.app
```

**CORS_ORIGIN:**
```
https://qpratik-xyz.vercel.app
```

☝️ **Vercel'den aldığınız URL'i buraya yapıştırın!**

5. **"Redeploy"** et (Deployments → En son deployment → "..." → "Redeploy")

---

## 🎊 TAMAMLANDI!

### Uygulamanız Canlıda! 🚀

**Frontend:** https://qpratik-xyz.vercel.app
**Backend:** https://qpratik-production-abc123.up.railway.app/api

---

## 🧪 TEST EDİN!

1. Frontend URL'e gidin
2. **"Kayıt Ol"** tıkla
3. Yeni hesap oluştur:
   - Email: test@test.com
   - Username: testuser
   - Password: Test123! (en az 8 karakter, büyük+küçük harf+rakam)
4. **"Register"** tıkla
5. Login olacaksınız
6. Dashboard görünecek! 🎉

**Admin ile de test edin:**
- Email: `admin@qpratik.com`
- Şifre: `Admin123!`

---

## 📱 Özellikler:

✅ Kayıt ve Login çalışıyor
✅ Dashboard görünüyor
✅ Profil sistemi aktif
✅ Dark/Light tema
✅ Dil değiştirme (EN/TR)

**Henüz çalışmayanlar (backend'de data lazım):**
- Content (admin panelden ekleyebilirsin)
- Tests (admin panelden ekleyebilirsin)
- Friends (başka kullanıcı gerekli)
- Practice (başka kullanıcı gerekli)

---

## 🔄 Güncelleme Yapmak

```bash
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"

# Kod değiştir (örnek: frontend/src/pages/Dashboard.tsx)
git add .
git commit -m "Update: dashboard improved"
git push

# Vercel ve Railway otomatik deploy eder!
# 1-2 dakika sonra canlıda görürsün
```

---

## ❓ Sorunlar?

**"Failed to compile":**
- Environment variables doğru mu?
- `VITE_API_URL` var mı?

**Login çalışmıyor:**
- Backend çalışıyor mu test et: `https://backend-url.up.railway.app/api`
- CORS ayarı yaptın mı?
- Browser console'da hata var mı? (F12 bas)

**"Network Error":**
- Backend URL doğru mu?
- Railway backend deploy başarılı mı?

---

## 📊 Deployment Özeti

✅ GitHub: https://github.com/Qyemek/Qpratik
✅ Railway (Backend): https://qpratik-production-xxx.up.railway.app
✅ Vercel (Frontend): https://qpratik-xyz.vercel.app
✅ PostgreSQL: Railway'de çalışıyor
✅ Redis: Railway'de çalışıyor

**Maliyet:** $0-5/ay

---

## 🎯 Sonraki Adımlar

1. ✅ Test et
2. ✅ Arkadaşlarınla paylaş
3. ✅ Geri bildirim topla
4. Admin panelden content ekle
5. Özelleştir ve geliştir!

---

## 📱 Mobil Uygulama (Bonus)

İlerleyen zamanlarda:

1. **https://median.co/** → "Create App"
2. URL: `https://qpratik-xyz.vercel.app`
3. Build → iOS & Android
4. App Store & Play Store'a yükle

---

**TEBRIKLER! 🎉**

Qpratik platformunuz canlıda ve kullanıma hazır!

**Başarılar! 🚀**
