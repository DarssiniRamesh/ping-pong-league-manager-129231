import React, { createContext, useContext, useEffect, useState } from 'react';
import Api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pp_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const me = await Api.me(token);
        if (!cancelled) setUser(me);
      } catch (e) {
        localStorage.removeItem('pp_token');
        if (!cancelled) setToken('');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('pp_token', newToken);
    setToken(newToken);
    setUser(userData || null);
  };

  const logout = () => {
    localStorage.removeItem('pp_token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
