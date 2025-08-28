import React from 'react';
import { theme } from '../theme';

export function Container({ children, style }) {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: theme.spacing(2),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.sm,
        padding: theme.spacing(2),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', style, ...props }) {
  const bg =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
      ? theme.colors.secondary
      : variant === 'accent'
      ? theme.colors.accent
      : variant === 'danger'
      ? theme.colors.danger
      : '#374151';
  return (
    <button
      {...props}
      style={{
        background: bg,
        border: 'none',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        fontWeight: 600,
        boxShadow: theme.shadow.sm,
        transition: 'transform .05s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        props.onMouseDown?.(e);
        e.currentTarget.style.transform = 'translateY(1px)';
      }}
      onMouseUp={(e) => {
        props.onMouseUp?.(e);
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ marginBottom: theme.spacing(1), ...style }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: 6,
            color: theme.colors.textMuted,
            fontSize: 14,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: theme.radius.sm,
          border: `1px solid ${error ? theme.colors.danger : theme.colors.border}`,
          outline: 'none',
          transition: 'border-color .2s',
        }}
      />
      {error && (
        <div style={{ color: theme.colors.danger, fontSize: 12, marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export function Select({ label, error, children, style, ...props }) {
  return (
    <div style={{ marginBottom: theme.spacing(1), ...style }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: 6,
            color: theme.colors.textMuted,
            fontSize: 14,
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: theme.radius.sm,
          border: `1px solid ${error ? theme.colors.danger : theme.colors.border}`,
          background: '#fff',
        }}
      >
        {children}
      </select>
      {error && (
        <div style={{ color: theme.colors.danger, fontSize: 12, marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export function Table({ columns = [], data = [], emptyText = 'No data', style }) {
  return (
    <div style={{ overflow: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: theme.radius.md,
          overflow: 'hidden',
          ...style,
        }}
      >
        <thead>
          <tr style={{ background: theme.colors.bgMuted }}>
            {columns.map((c) => (
              <th
                key={c.key || c.accessor}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  fontSize: 13,
                  color: theme.colors.textMuted,
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 16, textAlign: 'center', color: theme.colors.textMuted }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                {columns.map((c) => (
                  <td key={c.key || c.accessor} style={{ padding: '12px' }}>
                    {typeof c.render === 'function' ? c.render(row) : row[c.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Alert({ type = 'info', children, style }) {
  const color =
    type === 'danger'
      ? theme.colors.danger
      : type === 'success'
      ? theme.colors.success
      : theme.colors.info;
  return (
    <div
      style={{
        background: `${color}10`,
        border: `1px solid ${color}40`,
        color,
        padding: '10px 12px',
        borderRadius: theme.radius.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ padding: 16, textAlign: 'center', color: theme.colors.textMuted }}>{text}</div>
  );
}

export function StatCard({ label, value, trend, color = theme.colors.accent }) {
  return (
    <Card style={{ textAlign: 'left' }}>
      <div style={{ fontSize: 13, color: theme.colors.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {trend != null && (
        <div style={{ fontSize: 12, color }}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </Card>
  );
}
