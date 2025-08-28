import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme, appTitle } from '../theme';
import { Button, Container } from './UI';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar supports dummy auth mode (no backend). It reads user from AuthContext.
 */
export default function Navbar() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  const NavLink = ({ to, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          padding: '8px 10px',
          color: active ? theme.colors.primary : '#111827',
          textDecoration: 'none',
          fontWeight: active ? 700 : 500,
          borderBottom: active ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#fff',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <Container style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div
            aria-label="Logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: theme.colors.primary,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontWeight: 800,
            }}
          >
            PP
          </div>
          <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>{appTitle}</div>
          <nav style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
            {token ? (
              <>
                <NavLink to="/" label="Dashboard" />
                <NavLink to="/log-game" label="Log Game" />
                <NavLink to="/leaderboard" label="Leaderboard" />
              </>
            ) : (
              <>
                <NavLink to="/login" label="Login" />
                <NavLink to="/register" label="Register" />
              </>
            )}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user && (
            <div style={{ fontSize: 14, color: theme.colors.textMuted }}>
              Signed in as <strong>{user.username || user.email || 'Player'}</strong>
            </div>
          )}
          {token && (
            <Button variant="secondary" onClick={logout} aria-label="Logout">
              Logout
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
