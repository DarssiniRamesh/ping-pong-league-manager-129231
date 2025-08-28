import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Loader, StatCard, Table } from '../components/UI';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import Api from '../services/api';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const s = await Api.getStats(token, user?.id ? `userId=${user.id}` : '');
        // If backend provides recent games as part of stats, handle; else safe default.
        const rec = Array.isArray(s?.recentGames) ? s.recentGames : [];
        if (!cancelled) {
          setStats(s);
          setRecent(rec);
        }
      } catch (e) {
        if (!cancelled) {
          setStats(null);
          setRecent([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const statCards = useMemo(() => {
    const totals = stats || {};
    return [
      { label: 'Games Played', value: totals.gamesPlayed ?? 0, color: theme.colors.primary },
      { label: 'Wins', value: totals.wins ?? 0, color: theme.colors.accent },
      { label: 'Losses', value: totals.losses ?? 0, color: theme.colors.secondary },
      {
        label: 'Win Rate',
        value: `${Math.round(((totals.wins || 0) / Math.max(1, totals.gamesPlayed || 1)) * 100)}%`,
        color: theme.colors.accent,
      },
      { label: 'ELO / Rating', value: totals.rating ?? totals.elo ?? '—', color: theme.colors.info },
    ];
  }, [stats]);

  return (
    <Container>
      <h2 style={{ marginBottom: 8 }}>Dashboard</h2>
      <p style={{ marginTop: 0, color: '#6b7280' }}>
        Track your performance and review recent matches.
      </p>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {statCards.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Recent Games</h3>
            </div>
            <Table
              columns={[
                { header: 'Date', accessor: 'date' },
                { header: 'Opponent', accessor: 'opponent' },
                { header: 'Score (You - Opp)', accessor: 'score' },
                { header: 'Result', accessor: 'result' },
              ]}
              data={recent.map((g) => ({
                date: g.date || g.playedAt || '',
                opponent: g.opponentName || g.opponent || '',
                score: `${g.playerScore ?? g.you ?? ''} - ${g.opponentScore ?? g.opp ?? ''}`,
                result:
                  g.result ||
                  (typeof g.playerScore === 'number' && typeof g.opponentScore === 'number'
                    ? g.playerScore > g.opponentScore
                      ? 'Win'
                      : 'Loss'
                    : ''),
              }))}
              emptyText="No recent games"
            />
          </Card>
        </>
      )}
    </Container>
  );
}
