const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  '/api';

// Simple wrapper for fetch with JSON body and error handling
async function http(path, { method = 'GET', body, token, headers } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, opts);
  const contentType = res.headers.get('content-type') || '';
  let data;
  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const Api = {
  /**
   * NOTE: In dummy auth mode, these auth endpoints are NOT used.
   * They remain for future backend integration.
   */

  /** Registers a new user (backend mode only) */
  // PUBLIC_INTERFACE
  register: (payload) => http('/auth/register', { method: 'POST', body: payload }),

  /** Logs in and returns token + user (backend mode only) */
  // PUBLIC_INTERFACE
  login: (payload) => http('/auth/login', { method: 'POST', body: payload }),

  /** Returns current profile by token (backend mode only) */
  // PUBLIC_INTERFACE
  me: (token) => http('/auth/me', { headers: {}, token }),

  /** Log a completed game match */
  // PUBLIC_INTERFACE
  logGame: (token, payload) => http('/games', { method: 'POST', body: payload, token }),

  /** Get stats for a user or all players */
  // PUBLIC_INTERFACE
  getStats: (token, query = '') => http(`/stats${query ? `?${query}` : ''}`, { token }),

  /** Get leaderboard rankings */
  // PUBLIC_INTERFACE
  getLeaderboard: (token, query = '') =>
    http(`/leaderboard${query ? `?${query}` : ''}`, { token }),

  /** Get players for selection */
  // PUBLIC_INTERFACE
  getPlayers: (token) => http('/players', { token }),
};

export default Api;
