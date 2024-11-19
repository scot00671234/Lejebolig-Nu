import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function SignupConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Velkommen til Lejebolig nu!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Din konto er blevet oprettet
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Vi har sendt en bekræftelsesmail til din email-adresse. Klik på linket i mailen for at bekræfte din konto.
          </p>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Har du ikke modtaget mailen?
            </p>
            <button
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              onClick={() => {/* TODO: Implement resend confirmation email */}}
            >
              Send bekræftelsesmail igen
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Gå til log ind
          </Link>
        </div>
      </div>
    </div>
  );
}
