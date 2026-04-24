import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin, signup as apiSignup } from '../lib/api';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

const TOKEN_KEY = 'aureum_token';
const USER_KEY = 'aureum_user';

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => readJson(USER_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const isAdmin = user?.role === 'admin';

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await apiLogin({ email, password });
      setToken(t);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, passwordConfirm }) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await apiSignup({
        name,
        email,
        password,
        passwordConfirm,
      });
      setToken(t);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ token, user, isAdmin, loading, login, signup, logout, refreshMe }),
    [token, user, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

