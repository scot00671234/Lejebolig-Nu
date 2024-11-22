import React, { useState } from 'react';
import { X, User, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'landlord' | 'tenant'>('tenant');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          name: formData.name,
          type: userType,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Log ind' : 'Opret konto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('tenant')}
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                userType === 'tenant'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User size={24} className={userType === 'tenant' ? 'text-indigo-600' : 'text-gray-400'} />
              <span className={userType === 'tenant' ? 'text-indigo-600' : 'text-gray-500'}>Lejer</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('landlord')}
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                userType === 'landlord'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 size={24} className={userType === 'landlord' ? 'text-indigo-600' : 'text-gray-400'} />
              <span className={userType === 'landlord' ? 'text-indigo-600' : 'text-gray-500'}>Udlejer</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Navn
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-200 rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adgangskode
            </label>
            <input
              type="password"
              required
              className="w-full p-2 border border-gray-200 rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isLogin ? 'Log ind' : 'Opret konto'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? 'Opret ny konto' : 'Har du allerede en konto? Log ind'}
          </button>
        </div>
      </div>
    </div>
  );
}