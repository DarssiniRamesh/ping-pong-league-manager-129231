import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Card, Container, Input } from '../components/UI';
import Api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await Api.register(form);
      const { token, user } = res;
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: 520 }}>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>Create account</h2>
        <p style={{ marginTop: 0, color: '#6b7280' }}>Join the league to log games and track your stats.</p>
        {error && <Alert type="danger" style={{ marginBottom: 10 }}>{error}</Alert>}
        <form onSubmit={onSubmit}>
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="coolplayer42"
            required
          />
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
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </Container>
  );
}
