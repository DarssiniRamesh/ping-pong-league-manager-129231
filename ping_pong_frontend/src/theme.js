export const theme = {
  colors: {
    primary: '#1f77b4',
    secondary: '#ff7f0e',
    accent: '#2ca02c',
    bg: '#ffffff',
    bgMuted: '#f6f8fa',
    text: '#1a1a1a',
    textMuted: '#4a4a4a',
    border: '#e5e7eb',
    danger: '#dc2626',
    success: '#16a34a',
    info: '#0ea5e9',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 10px rgba(0,0,0,0.08)',
    lg: '0 10px 25px rgba(0,0,0,0.12)',
  },
  spacing: (n) => `${n * 8}px`,
};

export const appTitle = 'Ping Pong League';
