import React, { useEffect, useState } from 'react';
import { Card, Container, Loader, Table } from '../components/UI';
import Api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const lb = await Api.getLeaderboard(token);
        if (!cancelled) setData(lb || []);
      } catch (e) {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Container>
      <h2 style={{ marginBottom: 8 }}>Leaderboard</h2>
      <p style={{ marginTop: 0, color: '#6b7280' }}>Top players in the league.</p>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={[
              { header: '#', render: (row, i) => row.rank ?? i + 1, key: 'rank' },
              { header: 'Player', accessor: 'name' },
              { header: 'Wins', accessor: 'wins' },
              { header: 'Losses', accessor: 'losses' },
              { header: 'Win Rate', render: (row) => `${Math.round((row.winRate ?? 0) * 100)}%`, key: 'wr' },
              { header: 'Rating', accessor: 'rating' },
              { header: 'Games', accessor: 'games' },
            ]}
            data={data.map((p, i) => ({
              rank: p.rank ?? i + 1,
              name: p.username || p.name || p.email,
              wins: p.wins ?? 0,
              losses: p.losses ?? 0,
              winRate:
                p.winRate ??
                ((p.wins || 0) / Math.max(1, (p.wins || 0) + (p.losses || 0))),
              rating: p.rating ?? p.elo ?? '—',
              games: p.games ?? (p.wins || 0) + (p.losses || 0),
            }))}
            emptyText="No leaderboard data"
          />
        )}
      </Card>
    </Container>
  );
}
