import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 font-inter selection:bg-purple-500/30 relative transition-colors duration-200">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>

      {/* Brand Header with Gradient */}
      <div className="flex items-center gap-3 mb-8 z-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
          <span className="material-symbols-outlined text-[26px]">task_alt</span>
        </div>
        <span className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-geist tracking-tight">
          TaskFlow
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
        <span>© 2026 TaskFlow. Engineered for peak productivity.</span>
      </div>
    </div>
  );
};
