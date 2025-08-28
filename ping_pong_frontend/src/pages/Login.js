import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Card, Container, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';

/**
 * DUMMY AUTH LOGIN
 * Uses AuthContext.login(email, password) which validates against localStorage users.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Dummy login: no API call
      await Promise.resolve(login(form.email, form.password));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: 520 }}>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>Login</h2>
        <p style={{ marginTop: 0, color: '#6b7280' }}>
          Welcome back! Please enter your credentials.
        </p>
        {error && <Alert type="danger" style={{ marginBottom: 10 }}>{error}</Alert>}
        <form onSubmit={onSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            required
          />
          <Button disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          New here? <Link to="/register">Create an account</Link>
        </div>
      </Card>
    </Container>
  );
}
