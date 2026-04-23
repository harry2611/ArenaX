# ArenaX

ArenaX is a resume-ready mobile esports tournament and social platform built as a full-stack monorepo. The project pairs an Expo + React Native client with a Java Spring Boot backend, PostgreSQL persistence, WebSocket-powered live updates, and Docker-based local infrastructure.

## What is included

- Mobile-first tournament discovery, bracket viewing, live leaderboard, team chat, profile, and friends flows
- Spring Boot REST APIs for auth, tournaments, teams, chat, notifications, and social actions
- STOMP/WebSocket broadcasting for leaderboard and match chat updates
- PostgreSQL-backed domain models for players, teams, tournaments, matches, and friendships
- Push notification token registration pipeline prepared for Firebase Cloud Messaging
- Docker Compose for database + backend startup
- GitHub Actions CI scaffold for mobile lint/type checks and backend tests

## Repository layout

```text
ArenaX/
  mobile/        Expo React Native application
  backend/       Spring Boot API
  .github/       CI workflows
```

## Core product flows

1. Players create an account and land on a gaming-style dashboard of active tournaments.
2. Users can inspect brackets, leaderboard standings, and team rosters in real time.
3. Team captains can create teams, invite players, and register for tournaments.
4. Players can manage friends, send invites, and join match chat rooms.
5. The backend publishes match and leaderboard updates over WebSockets so the mobile app can react instantly.

## Mobile stack

- React Native with Expo
- TypeScript
- React Navigation
- Zustand
- TanStack Query with offline persistence
- Expo Notifications
- STOMP over WebSockets

## Backend stack

- Java 21+ / Spring Boot
- Spring Security with JWT auth
- Spring Data JPA
- PostgreSQL
- Spring WebSocket
- Docker

## Local setup

### 1. Copy env values

Create a `.env` file at the repo root using `.env.example`.

### 2. Start infrastructure

```bash
docker compose up --build
```

This starts PostgreSQL and the Spring Boot backend on port `8080`.

### 3. Run the mobile app

```bash
cd mobile
npm install
npm run start
```

If you run the Expo app on a physical device, point `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_WS_BASE_URL` at your machine's LAN IP instead of `localhost`.

### 4. Run the backend without Docker

If Maven is installed locally:

```bash
cd backend
mvn spring-boot:run
```

## Demo credentials

Seed data creates these sample users:

- `captain@arenax.gg` / `password123`
- `pro@arenax.gg` / `password123`
- `rookie@arenax.gg` / `password123`
- `admin@arenax.gg` / `password123`

## Notes

- Firebase server credentials are not committed; the app currently registers device tokens and leaves message sending ready for environment-specific wiring.
- The backend codebase is scaffolded for extension into admin tools, moderation, analytics, and more advanced matchmaking.
- This repository was created from scratch in an empty git-linked `ArenaX` folder, so install-generated lockfiles and wrappers are intentionally not committed yet.
