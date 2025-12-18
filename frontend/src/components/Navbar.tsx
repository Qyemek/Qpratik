import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, LogOut, User, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Qpratik
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/learn" className="hover:text-primary-600">
              {t('nav.learn')}
            </Link>
            <Link to="/practice" className="hover:text-primary-600">
              {t('nav.practice')}
            </Link>
            <Link to="/tests" className="hover:text-primary-600">
              {t('nav.tests')}
            </Link>
            <Link to="/friends" className="hover:text-primary-600">
              {t('nav.friends')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="btn btn-secondary text-sm">
              {i18n.language === 'en' ? 'TR' : 'EN'}
            </button>

            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell size={20} />
            </Link>

            <Link to="/profile" className="flex items-center gap-2">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
              <span className="font-medium">{user?.username}</span>
            </Link>

            <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
