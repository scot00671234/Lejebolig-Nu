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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl animate-slideUp">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Log ind' : 'Opret konto'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('tenant')}
              className={`flex-1 p-6 rounded-xl border-2 flex flex-col items-center gap-3
                transition-all duration-300 hover:shadow-md ${
                userType === 'tenant'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${userType === 'tenant' ? 'bg-blue-100' : 'bg-gray-50'} transition-colors`}>
                <User size={24} className={userType === 'tenant' ? 'text-blue-600' : 'text-gray-400'} />
              </div>
              <span className={`font-medium ${userType === 'tenant' ? 'text-blue-600' : 'text-gray-600'}`}>Lejer</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('landlord')}
              className={`flex-1 p-6 rounded-xl border-2 flex flex-col items-center gap-3
                transition-all duration-300 hover:shadow-md ${
                userType === 'landlord'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${userType === 'landlord' ? 'bg-blue-100' : 'bg-gray-50'} transition-colors`}>
                <Building2 size={24} className={userType === 'landlord' ? 'text-blue-600' : 'text-gray-400'} />
              </div>
              <span className={`font-medium ${userType === 'landlord' ? 'text-blue-600' : 'text-gray-600'}`}>Udlejer</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Navn
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 outline-none
                         hover:border-gray-200"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dit fulde navn"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-300 outline-none
                       hover:border-gray-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="din@email.dk"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adgangskode
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-300 outline-none
                       hover:border-gray-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 8 tegn"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 
                     transition-colors font-medium shadow-sm hover:shadow-md
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLogin ? 'Log ind' : 'Opret konto'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Opret ny konto' : 'Har du allerede en konto? Log ind'}
          </button>
        </div>
      </div>
    </div>
  );
}