import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        username: 'Username',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
      },
      nav: {
        home: 'Home',
        learn: 'Learn',
        practice: 'Practice',
        tests: 'Tests',
        friends: 'Friends',
        profile: 'Profile',
      },
      auth: {
        welcomeBack: 'Welcome Back!',
        createAccount: 'Create Account',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        acceptTerms: 'I accept the Terms and Privacy Policy',
      },
      dashboard: {
        welcome: 'Welcome, {{name}}!',
        level: 'Level',
        xp: 'XP',
        streak: 'Day Streak',
        minutes: 'Minutes',
        credits: 'Credits',
      },
    },
  },
  tr: {
    translation: {
      common: {
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        logout: 'Çıkış Yap',
        email: 'E-posta',
        password: 'Şifre',
        username: 'Kullanıcı Adı',
        submit: 'Gönder',
        cancel: 'İptal',
        save: 'Kaydet',
        delete: 'Sil',
        edit: 'Düzenle',
        search: 'Ara',
        loading: 'Yükleniyor...',
        error: 'Bir hata oluştu',
        success: 'Başarılı!',
      },
      nav: {
        home: 'Ana Sayfa',
        learn: 'Öğren',
        practice: 'Pratik',
        tests: 'Testler',
        friends: 'Arkadaşlar',
        profile: 'Profil',
      },
      auth: {
        welcomeBack: 'Tekrar Hoş Geldin!',
        createAccount: 'Hesap Oluştur',
        forgotPassword: 'Şifremi Unuttum?',
        noAccount: 'Hesabın yok mu?',
        haveAccount: 'Zaten hesabın var mı?',
        acceptTerms: 'Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum',
      },
      dashboard: {
        welcome: 'Hoş geldin, {{name}}!',
        level: 'Seviye',
        xp: 'XP',
        streak: 'Günlük Seri',
        minutes: 'Dakika',
        credits: 'Kredi',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
