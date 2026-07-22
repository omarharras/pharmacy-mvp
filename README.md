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

Set up a local Postgres database, create `apps/api/.env` from `apps/api/.env.example`,
then push the schema and seed demo data:

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

## Render Deployment

This repo includes `render.yaml` for a Render Blueprint that creates:

- `pharmacy-mvp-api`: Node.js web service for `apps/api`.
- `pharmacy-mvp-db`: Render Postgres database.

Deploy steps:

```bash
git push
```

Then in Render, create a new Blueprint from this repo. Render will run:

```bash
npm ci && npm run api:build
npm run api:db:push
npm run api:db:seed
npm --workspace @pharmacy/api run start
```

After deployment, verify:

```bash
https://your-render-service.onrender.com/health
```

For the APK build, set the mobile app API URL to the Render service URL:

```bash
EXPO_PUBLIC_API_URL=https://your-render-service.onrender.com
```

Static catalog images are served from `apps/api/public/images` at `/images/...`.
User uploads under `/uploads/...` are temporary on Render unless a persistent disk or
external object storage is added later.
