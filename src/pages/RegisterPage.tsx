import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail, validatePassword } from '../utils/validators';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  const nameError = touched.name && !nameValidation.isValid ? nameValidation.message : null;
  const emailError = touched.email && !emailValidation.isValid ? emailValidation.message : null;
  const passwordError = touched.password && !passwordValidation.isValid ? passwordValidation.message : null;

  const isFormValid =
    nameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
    });

    if (!isFormValid) {
      setFormError('Please resolve all validation errors before proceeding.');
      return;
    }

    try {
      setLoading(true);
      setFormError(null);
      await register(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch {
      setFormError('Registration failed. Please try again with a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-geist tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Set up your profile to start organizing tasks seamlessly.</p>
      </div>

      {formError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">
              person
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="e.g. Priyanshu Sharma"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-all ${
                nameError
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-purple-500'
              }`}
            />
          </div>
          {nameError && <p className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{nameError}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Work Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">
              mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="name@company.com"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-all ${
                emailError
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-purple-500'
              }`}
            />
          </div>
          {emailError && <p className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{emailError}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">
              lock
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              placeholder="Create a strong password"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-all ${
                passwordError
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-purple-500'
              }`}
            />
          </div>
          {passwordError ? (
            <p className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{passwordError}</p>
          ) : (
            <p className="text-[11px] text-slate-500 pl-1">
              Minimum 8 characters with 1 uppercase letter and 1 number.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2 active:scale-95"
        >
          {loading ? (
            <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
          ) : (
            <>
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Already registered? </span>
        <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
