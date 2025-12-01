# MCP Time-Traveler API

Express + TypeScript backend that provides historical stack recommendations.

## Setup

```bash
cd apps/api
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:4000

## API Endpoints

### POST /api/generate

Request body:
```json
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "extras": ["testing", "orm"]
}
```

Response:
```json
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "runtime_version": "14.15.0",
  "package_manager": "npm@6.14.8",
  "packages": [...],
  "notes": "..."
}
```

### GET /health

Health check endpoint.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types without building
