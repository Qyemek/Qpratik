import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      toast.error('Please accept terms and privacy policy');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      toast.success(t('common.success'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">{t('auth.createAccount')}</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            {t('common.login')}
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('common.email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('common.username')}</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('common.password')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={formData.acceptedTerms && formData.acceptedPrivacy}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  acceptedTerms: e.target.checked,
                  acceptedPrivacy: e.target.checked,
                })
              }
              className="mt-1"
              required
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">{t('auth.acceptTerms')}</label>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
            {isLoading ? t('common.loading') : t('common.register')}
          </button>
        </form>
      </div>
    </div>
  );
}
