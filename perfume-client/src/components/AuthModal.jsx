import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
};

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        if (formData.password !== formData.passwordConfirm) {
          setError('Passwords do not match');
          return;
        }

        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        });
      }

      setFormData(emptyForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setError(null);
    setFormData(emptyForm);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-stone-200 bg-gradient-to-br from-white via-stone-50 to-amber-50 shadow-[0_30px_80px_rgba(28,25,23,0.18)]"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 rounded-full border border-stone-200 bg-white/90 p-2 text-stone-500 transition-colors hover:text-stone-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-8 text-center">
                <span className="mb-4 inline-block rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-amber-700">
                  Aureum Account
                </span>
                <h2 className="mb-3 text-4xl font-serif text-stone-900">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  {isLogin
                    ? 'Enter your details to access your collection'
                    : 'Join the world of Aureum masterpieces'}
                </p>
              </div>

              <div className="mb-8 grid grid-cols-2 rounded-full border border-stone-200 bg-white/70 p-1 text-[10px] uppercase tracking-[0.3em] shadow-sm">
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={`rounded-full px-4 py-3 transition-colors ${
                    isLogin ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={`rounded-full px-4 py-3 transition-colors ${
                    !isLogin ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                      Full Name
                    </label>
                    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent py-4 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:ring-2 focus:ring-amber-400/40"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                    Email Address
                  </label>
                  <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent py-4 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:ring-2 focus:ring-amber-400/40"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-[9px] uppercase tracking-[0.3em] text-amber-700 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent py-4 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:ring-2 focus:ring-amber-400/40"
                      placeholder="********"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                      Confirm Password
                    </label>
                    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="password"
                        name="passwordConfirm"
                        required
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        className="w-full bg-transparent py-4 pl-11 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:ring-2 focus:ring-amber-400/40"
                        placeholder="********"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-stone-900 bg-stone-900 py-4 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-sm transition-colors hover:border-amber-600 hover:bg-amber-600"
                >
                  {loading
                    ? isLogin
                      ? 'Signing in...'
                      : 'Creating account...'
                    : isLogin
                      ? 'Sign In'
                      : 'Create Account'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={() => switchMode(!isLogin)}
                  className="text-[10px] uppercase tracking-[0.3em] text-stone-500 transition-colors hover:text-amber-700"
                >
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
