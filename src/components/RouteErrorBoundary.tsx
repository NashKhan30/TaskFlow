import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center font-inter">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4 shadow-xl shadow-rose-500/20">
        <span className="material-symbols-outlined text-[36px]">error</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 font-geist">
        {errorStatus} - Something went wrong
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {errorMessage}
      </p>
      <Link
        to="/"
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95"
      >
        <span className="material-symbols-outlined text-[18px]">home</span>
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};
