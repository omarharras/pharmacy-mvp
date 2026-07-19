# Pharmacy MVP

Premium pharmacy MVP for El Khabiry-inspired mobile ordering.

## Project Structure

- `apps/mobile`: Expo + React Native + TypeScript mobile app.
- `apps/api`: Node.js API workspace. Backend implementation comes next.
- `docs/pharmacy-mvp-plan.md`: agreed MVP product and technical plan.

## Requirements

- Node.js 20.19.x or newer for Expo SDK 54.
- npm.

## Install

```bash
npm install
```

## Mobile App

Start the Expo app:

```bash
npm start
```

Other mobile commands:

```bash
npm run mobile:android
npm run mobile:ios
npm run mobile:web
npm run mobile:typecheck
npm run mobile:lint
```

The mobile app uses Expo Router file-based routing under `apps/mobile/app`.

To point the mobile app at the API, create `apps/mobile/.env` from the example:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
```

If you test on a physical phone with Expo Go, replace `localhost` with your computer's LAN IP address, for example `http://192.168.1.20:4000`.

## API

The API workspace exists at `apps/api`.

Set up the local SQLite database and seed demo data:

```bash
npm run api:db:push
npm run api:db:seed
```

Start the API:

```bash
npm run api:dev
```

API commands:

```bash
npm run api:typecheck
npm run api:build
```

The API runs on `http://localhost:4000` by default.
