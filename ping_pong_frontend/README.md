# Ping Pong League Frontend (React)

Modern, lightweight React app for the Ping Pong League. Users can register/login, log games, view their statistics, and see leaderboard rankings.

## Features

- User registration and login
- Log game results
- Player statistics dashboard (games, wins, losses, win rate, rating)
- Leaderboard rankings
- Responsive UI with clean light theme
- REST API integration with .env-based configuration

## Getting Started

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Set REACT_APP_API_BASE_URL to your backend base URL (e.g., http://localhost:4000)

3. Run the app:
   npm start

App runs on http://localhost:3000

## Environment

- REACT_APP_API_BASE_URL: Base URL of the backend API (e.g. http://localhost:4000)
If unset, app will call relative /api paths.

## Code Structure

- src/services/api.js: All REST calls; honors REACT_APP_API_BASE_URL
- src/context/AuthContext.js: Auth state, token persistence
- src/components: Navbar, ProtectedRoute, and UI primitives
- src/pages: Login, Register, Dashboard, LogGame, Leaderboard
- src/theme.js: Theme and brand colors (#1f77b4, #ff7f0e, #2ca02c)

## Backend Endpoints (expected)

- POST /auth/register { username, email, password } -> { token, user }
- POST /auth/login { email, password } -> { token, user }
- GET /auth/me -> { id, username, email }
- GET /players -> [{ id, username, ... }]
- POST /games { playerId, opponentId, playerScore, opponentScore, playedAt?, notes? }
- GET /stats?userId=... -> { gamesPlayed, wins, losses, rating, recentGames: [] }
- GET /leaderboard -> [{ rank, username, wins, losses, rating }]

Adjust api.js if your backend differs.

## Styling

Light, modern UI with accent colors:
- Primary: #1f77b4
- Secondary: #ff7f0e
- Accent: #2ca02c

No heavy UI framework; pure React + vanilla CSS.

