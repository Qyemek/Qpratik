# 🚀 OTOMATIK DEPLOYMENT KOMUATLARI

## GitHub'a Manuel Push İçin:

1. GitHub'da yeni repo oluştur: https://github.com/new
   - Repository name: `qpratik`
   - Public veya Private seç
   - "Create repository" tıkla

2. Sonra terminalde:

```bash
cd "C:\Users\akyur\OneDrive\Masaüstü\Qpratik"
git remote add origin https://github.com/KULLANICI_ADIN/qpratik.git
git push -u origin main
```

---

## VEYA Railway ile Direkt Deploy (GitHub Olmadan):

Railway CLI ile direkt deploy edebilirsiniz:

```bash
# Railway CLI yükle
npm install -g @railway/cli

# Login
railway login

# Init project
railway init

# Link to new project
railway up

# PostgreSQL ekle
railway add -d postgres

# Redis ekle
railway add -d redis

# Environment variables
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="qpratik-production-secret-2024"
# ... diğer variables

# Deploy
railway up
```

Şimdi ben projeyi alternatif yollarla deploy etmeye çalışacağım...
