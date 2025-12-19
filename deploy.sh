#!/bin/bash

echo "========================================"
echo "  QPRATIK OTOMATIK DEPLOYMENT"
echo "========================================"
echo ""

echo "[1/6] Git commit kontrol..."
cd "$(dirname "$0")"
git status

echo ""
echo "[2/6] Railway CLI yükleniyor..."
npm install -g @railway/cli

echo ""
echo "[3/6] Railway login..."
echo "Lütfen tarayıcıda açılan pencereden Railway hesabınıza giriş yapın..."
railway login

echo ""
echo "[4/6] Railway projesi oluşturuluyor..."
railway init

echo ""
echo "[5/6] PostgreSQL ekleniyor..."
railway add --database postgres

echo ""
echo "[5.5/6] Redis ekleniyor..."
railway add --database redis

echo ""
echo "[6/6] Environment variables ayarlanıyor..."
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=qpratik-production-jwt-secret-min-32-chars-2024
railway variables set JWT_REFRESH_SECRET=qpratik-production-refresh-secret-min-32-chars-2024
railway variables set FRONTEND_URL=https://qpratik.vercel.app
railway variables set CORS_ORIGIN=https://qpratik.vercel.app

echo ""
echo "[7/6] Backend deploy ediliyor..."
railway up

echo ""
echo "[8/6] Migrations çalıştırılıyor..."
railway run npx prisma migrate deploy
railway run npx prisma db seed

echo ""
echo "========================================"
echo "  BACKEND DEPLOY TAMAMLANDI!"
echo "========================================"
echo ""
echo "Backend URL'nizi not alın:"
railway status
echo ""
read -p "Devam etmek için Enter'a basın..."

echo ""
echo "========================================"
echo "  FRONTEND DEPLOY BAŞLATILIYOR..."
echo "========================================"
echo ""

cd frontend

echo "[1/3] Vercel CLI yükleniyor..."
npm install -g vercel

echo ""
echo "[2/3] Vercel login..."
vercel login

echo ""
echo "[3/3] Frontend deploy ediliyor..."
vercel --prod

echo ""
echo "========================================"
echo "  DEPLOYMENT TAMAMLANDI!"
echo "========================================"
echo ""
echo "Uygulamanız canlıda!"
echo ""
read -p "Çıkmak için Enter'a basın..."
