import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Trophy, Zap, Calendar, Clock } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.welcome', { name: user?.username })}</h1>
        <p className="text-gray-600 dark:text-gray-400">Continue your English learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Trophy className="text-primary-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.level')}</p>
            <p className="text-2xl font-bold">{user?.level}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <Zap className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.xp')}</p>
            <p className="text-2xl font-bold">{user?.xp}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <Calendar className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.streak')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Clock className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.minutes')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-600 dark:text-gray-400">No recent activity yet. Start learning!</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Your Badges</h2>
          <p className="text-gray-600 dark:text-gray-400">Earn badges by completing lessons and tests!</p>
        </div>
      </div>
    </div>
  );
}
