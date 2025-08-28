import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * DUMMY AUTH IMPLEMENTATION (Frontend-only)
 * -----------------------------------------
 * This context provides a mock authentication flow without any backend.
 * - Registered users are stored in localStorage under "pp_users" (array of users).
 * - The current "session" is stored in localStorage as:
 *     - "pp_token": a mock token string
 *     - "pp_user": the current user object (serialized)
 *
 * SECURITY NOTE:
 * This is ONLY for demo/development without a backend. Do NOT use in production.
 */

const AuthContext = createContext(null);

// Helpers for dummy storage
function loadUsers() {
  try {
    const raw = localStorage.getItem('pp_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem('pp_users', JSON.stringify(users));
}
function loadSession() {
  const token = localStorage.getItem('pp_token') || '';
  const rawUser = localStorage.getItem('pp_user');
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }
  return { token, user };
}
function saveSession(token, user) {
  localStorage.setItem('pp_token', token);
  localStorage.setItem('pp_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_user');
}

/**
 * Generate a simple mock token.
 */
function makeToken(email) {
  return `dummy-${btoa(`${email}-${Date.now()}`)}`;
}

/**
 * Create a user object with basic fields.
 */
function makeUser({ username, email, password }) {
  // Very naive id generator from timestamp
  return {
    id: Date.now(),
    username: username || email?.split('@')[0] || 'player',
    email,
    password, // stored in plain text ONLY for dummy demo. NEVER do this in real apps.
  };
}

export function AuthProvider({ children }) {
  const initial = loadSession();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [loading, setLoading] = useState(false); // no async "me" call in dummy mode

  /**
   * PUBLIC_INTERFACE
   * login
   * Dummy login: checks localStorage users and matches email+password.
   */
  const login = (email, password) => {
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      const err = new Error('Invalid email or password');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    const newToken = makeToken(email);
    saveSession(newToken, { id: found.id, username: found.username, email: found.email });
    setToken(newToken);
    setUser({ id: found.id, username: found.username, email: found.email });
  };

  /**
   * PUBLIC_INTERFACE
   * register
   * Dummy register: adds a new user to localStorage and signs them in.
   */
  const register = ({ username, email, password }) => {
    const users = loadUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) {
      const err = new Error('Email already registered');
      err.code = 'EMAIL_EXISTS';
      throw err;
    }
    const newUser = makeUser({ username, email, password });
    users.push(newUser);
    saveUsers(users);

    const newToken = makeToken(email);
    const publicUser = { id: newUser.id, username: newUser.username, email: newUser.email };
    saveSession(newToken, publicUser);
    setToken(newToken);
    setUser(publicUser);
  };

  /**
   * PUBLIC_INTERFACE
   * logout
   * Clears dummy session.
   */
  const logout = () => {
    clearSession();
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
