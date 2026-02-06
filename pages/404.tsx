// 404 - Not Found
import React from 'react';
import { ArrowRight } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigateHome = () => {
    window.location.href = `${window.location.origin}/#/home`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6">404</h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <button
          onClick={navigateHome}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-500/30 active:scale-95"
        >
          Go to Home page <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;