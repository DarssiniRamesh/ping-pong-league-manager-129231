import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Input, Select } from '../components/UI';
import Api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LogGame() {
  const { token, user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    opponentId: '',
    yourScore: '',
    opponentScore: '',
    notes: '',
    playedAt: '',
  });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await Api.getPlayers(token);
        if (!cancelled) setPlayers(res || []);
      } catch (e) {
        if (!cancelled) setPlayers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });

    const { opponentId, yourScore, opponentScore } = form;
    if (!opponentId) return setStatus({ error: 'Please select an opponent.' });
    if (yourScore === '' || opponentScore === '') {
      return setStatus({ error: 'Please enter both scores.' });
    }
    if (Number(yourScore) === Number(opponentScore)) {
      return setStatus({ error: 'Scores cannot be equal; ping pong games require a winner.' });
    }

    setSubmitting(true);
    try {
      await Api.logGame(token, {
        playerId: user?.id,
        opponentId: Number(opponentId),
        playerScore: Number(yourScore),
        opponentScore: Number(opponentScore),
        notes: form.notes || undefined,
        playedAt: form.playedAt || undefined,
      });
      setStatus({ success: 'Game logged successfully!' });
      setForm({ opponentId: '', yourScore: '', opponentScore: '', notes: '', playedAt: '' });
    } catch (err) {
      setStatus({ error: err.message || 'Failed to log game.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: 720 }}>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>Log a Game</h2>
        <p style={{ marginTop: 0, color: '#6b7280' }}>
          Record a completed match with an opponent.
        </p>
        {status.error && <Alert type="danger" style={{ marginBottom: 10 }}>{status.error}</Alert>}
        {status.success && <Alert type="success" style={{ marginBottom: 10 }}>{status.success}</Alert>}
        <form onSubmit={onSubmit}>
          <Select
            label="Opponent"
            name="opponentId"
            value={form.opponentId}
            onChange={onChange}
            required
          >
            <option value="">Select opponent...</option>
            {players
              .filter((p) => p.id !== user?.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username || p.name || p.email}
                </option>
              ))}
          </Select>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <Input
              label="Your Score"
              name="yourScore"
              type="number"
              min="0"
              value={form.yourScore}
              onChange={onChange}
              required
            />
            <Input
              label="Opponent Score"
              name="opponentScore"
              type="number"
              min="0"
              value={form.opponentScore}
              onChange={onChange}
              required
            />
          </div>
          <Input
            label="Played At (optional)"
            name="playedAt"
            type="datetime-local"
            value={form.playedAt}
            onChange={onChange}
          />
          <Input
            label="Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={onChange}
            placeholder="Rallies, highlights, etc."
          />
          <Button style={{ marginTop: 8 }} disabled={submitting}>
            {submitting ? 'Saving...' : 'Log Game'}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
