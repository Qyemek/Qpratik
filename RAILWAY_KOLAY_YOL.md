# 🚂 RAILWAY DEPLOYMENT - EN KOLAY YOL

## Yöntem 1: Web Dashboard (ÖNERİLEN - En Kolay)

### Adım 1: Railway Hesabı Oluştur

1. **https://railway.app/** aç
2. **"Login"** veya **"Start a New Project"** tıkla
3. **"Login with GitHub"** seç
4. GitHub hesabınla giriş yap (otomatik olacak)

✅ Artık Railway dashboard'dasınız!

---

### Adım 2: GitHub Repository'yi Bağla

1. Railway dashboard'da **"+ New Project"** tıkla
2. **"Deploy from GitHub repo"** seç
3. İlk kez bağlıyorsanız **"Configure GitHub App"** çıkacak → Tıkla
4. GitHub'da **"Only select repositories"** seç
5. **"Select repositories"** dropdown → **"Qpratik"** seç
6. **"Install & Authorize"** tıkla
7. Railway'e geri döneceksiniz
8. **"Deploy from GitHub repo"** tekrar tıkla
9. **"Qpratik"** repository'yi listede göreceksiniz → Seç

✅ Proje oluşturuldu! Şimdi ayarlayalım.

---

### Adım 3: Backend Servisini Ayarla

Railway otomatik deploy başlatacak ama hata verecek (normal). Şimdi düzeltelim:

1. Oluşan **"qpratik"** servisine tıkla
2. Üstte **"Settings"** sekmesine git
3. Aşağı kaydır, **"Root Directory"** bul
4. Boş kutuya `backend` yaz
5. **"Deploy"** veya **"Redeploy"** butonuna bas

❌ Hala hata verecek çünkü database yok. Devam edelim.

---

### Adım 4: PostgreSQL Ekle

1. Sol üstte **proje isminin** yanındaki **"+"** işaretine tıkla
2. **"Database"** seç
3. **"Add PostgreSQL"** tıkla
4. Otomatik oluşacak, 10 saniye bekle

✅ PostgreSQL hazır!

---

### Adım 5: Redis Ekle

1. Tekrar sol üstte **"+"** tıkla
2. **"Database"** seç
3. **"Add Redis"** tıkla
4. Otomatik oluşacak, 10 saniye bekle

✅ Redis hazır!

---

### Adım 6: Redis Host'u Al

1. **"Redis"** servisine tıkla
2. **"Connect"** sekmesine git
3. **"Private URL"** altında bir URL göreceksiniz
4. Sadece **host kısmını** kopyalayın (örnek: `containers-us-west-123.railway.app`)
5. Not defterine yapıştırın

---

### Adım 7: Environment Variables Ekle

1. **"qpratik"** (backend) servisine geri dön
2. **"Variables"** sekmesine git
3. **"+ New Variable"** tıkla ve şunları tek tek ekle:

```
NODE_ENV = production
PORT = 3001
JWT_SECRET = qpratik-railway-prod-secret-2024-min-32-chars-change-this
JWT_REFRESH_SECRET = qpratik-railway-refresh-secret-2024-min-32-chars-change
FRONTEND_URL = https://qpratik.vercel.app
CORS_ORIGIN = https://qpratik.vercel.app
REDIS_HOST = (yukarıda kopyaladığınız Redis host)
REDIS_PORT = 6379
```

**REDIS_HOST değerini yapıştırırken sadece host kısmını kullanın!**
Örnek: `redis://default:xxx@containers-us-west-123.railway.app:6379` ise
Sadece: `containers-us-west-123.railway.app` kısmını alın

**DATABASE_URL otomatik gelecek, eklemeyin!**

---

### Adım 8: Deploy'u Bekle

Variables ekledikten sonra otomatik redeploy başlayacak.

1. **"Deployments"** sekmesine git
2. En üstteki deployment'ı izle
3. Log'ları göreceksiniz (yeşil = başarılı, kırmızı = hata)
4. **"SUCCESS"** yazısını bekle (2-3 dakika)

❌ Hata aldınız mı? Migration hatası normaldir. Çözelim:

---

### Adım 9: Migration Çalıştır (Hata Aldıysanız)

Railway henüz migration'ları otomatik çalıştıramadı. Manuel yapalım:

1. Backend servisinde **"Settings"** sekmesi
2. Aşağı kaydır, **"Deploy Command"** bul
3. Değiştir:

```
npm run start:prod
```

Yerine şunu yaz:

```
npx prisma migrate deploy && npx prisma db seed && npm run start:prod
```

4. Tekrar **"Deployments"** sekmesi
5. **"Redeploy"** tıkla

Bu sefer başarılı olacak! ✅

---

### Adım 10: Backend URL'ini Al

1. Backend servisinde **"Settings"** sekmesi
2. **"Domains"** bölümünde **"Generate Domain"** tıkla
3. Oluşan URL'i kopyala (örnek: `qpratik-production-abc123.up.railway.app`)
4. **BU ÇOK ÖNEMLİ - NOT ALIN!** 📝

✅ Backend hazır ve çalışıyor!

---

## ✅ TAMAMLANDI!

Backend Railway'de canlı! 🎉

**Backend URL'iniz:** `https://qpratik-production-xxx.up.railway.app`

**Test edin:**
`https://qpratik-production-xxx.up.railway.app/api`

404 veya "Cannot GET /" görmek normal (API çalışıyor demek)

---

## 🎨 Şimdi Frontend'i Deploy Edin

**VERCEL_DEPLOYMENT.md** dosyasını açın!

---

## ❓ Sorunlar?

**"Build failed" hatası:**
- Variables'ı kontrol et
- DATABASE_URL var mı?
- REDIS_HOST doğru mu?

**"Migration failed":**
- Deploy Command'a migration ekledin mi?
- Redeploy yaptın mı?

**Başka hata:**
- Logs'a bak: Deployments → Log'a tıkla
- Hatayı bana göster, çözelim!

---

**İlerleyin! Neredeyse bitti!** 🚀
