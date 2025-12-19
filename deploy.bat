@echo off
echo ========================================
echo   QPRATIK OTOMATIK DEPLOYMENT
echo ========================================
echo.

echo [1/6] Git commit kontrol...
cd /d "%~dp0"
git status

echo.
echo [2/6] Railway CLI yukluyor...
call npm install -g @railway/cli

echo.
echo [3/6] Railway login...
echo Lutfen tarayicida acilan pencereden Railway hesabiniza giris yapin...
call railway login

echo.
echo [4/6] Railway projesi olusturuluyor...
call railway init

echo.
echo [5/6] PostgreSQL ekleniyor...
call railway add --database postgres

echo.
echo [5.5/6] Redis ekleniyor...
call railway add --database redis

echo.
echo [6/6] Environment variables ayarlaniyor...
call railway variables set NODE_ENV=production
call railway variables set PORT=3001
call railway variables set JWT_SECRET=qpratik-production-jwt-secret-min-32-chars-2024
call railway variables set JWT_REFRESH_SECRET=qpratik-production-refresh-secret-min-32-chars-2024
call railway variables set FRONTEND_URL=https://qpratik.vercel.app

echo.
echo [7/6] Backend deploy ediliyor...
call railway up

echo.
echo [8/6] Migrations calistiriliyor...
call railway run npx prisma migrate deploy
call railway run npx prisma db seed

echo.
echo ========================================
echo   BACKEND DEPLOY TAMAMLANDI!
echo ========================================
echo.
echo Backend URL'nizi not alin:
call railway status
echo.
pause

echo.
echo ========================================
echo   FRONTEND DEPLOY BASLATILIYOR...
echo ========================================
echo.

cd frontend

echo [1/3] Vercel CLI yukluyor...
call npm install -g vercel

echo.
echo [2/3] Vercel login...
call vercel login

echo.
echo [3/3] Frontend deploy ediliyor...
call vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT TAMAMLANDI!
echo ========================================
echo.
echo Uygulamaniz canlida!
echo.
pause
