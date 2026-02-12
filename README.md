# VibeRX - Spotify Playlist Optimizer

> **PROJECT STATUS: PAUSED / DISCONTINUED (February 2026)**
>
> VibeRX was designed to optimize Spotify playlists like a professional DJ set using BPM, key, and energy analysis from Spotify's Audio Features API. Development reached a working state — Spotify OAuth PKCE authentication, playlist reading, database integration, design system, and Vercel deployment were all complete and functional.
>
> However, Spotify's November 2024 API restrictions (enforced for new apps) block access to the Audio Features and Audio Analysis endpoints, which were the core data source for the entire optimization concept. This was confirmed on 2026-02-11 when the Audio Features endpoint returned 403 Forbidden in dev mode. MusicBrainz was evaluated as an alternative but only provides metadata (artist, album, release) — not audio features like BPM, key, or energy. No viable free alternative data source exists.
>
> Combined with Spotify's February 2026 platform changes (dev mode limited to 5 users, extended quota applications restricted), the path to building and shipping this app as originally designed is no longer feasible.
>
> **What was built and works:**
> - Spotify OAuth PKCE authentication (login, callback, refresh, logout)
> - Playlist reading via the Spotify Web API
> - Prisma 7 + Supabase PostgreSQL database
> - tRPC v11 API layer with protected procedures
> - Cookie-based session management (httpOnly, no localStorage)
> - shadcn/ui design system with custom VibeRX branding
> - Next.js 16 proxy-based route protection
> - Vercel deployment with environment validation
>
> **What was blocked:**
> - `GET /audio-features/{id}` — 403 Forbidden (restricted for new apps since Nov 2024)
> - `GET /audio-analysis/{id}` — same restriction
> - Recommendations endpoint — same restriction
> - 30-second preview URLs — same restriction
>
> See `docs/decisions.md` for the full decision log and `docs/progress.md` for checkpoint details. This codebase remains a useful reference for Next.js 16 + Spotify OAuth + tRPC + Prisma 7 patterns.

---

**Your prescription for the perfect playlist.** VibeRX optimizes Spotify playlists like a professional DJ using BPM, key, and energy analysis.

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Linting/Formatting:** Biome
- **API Layer:** tRPC (end-to-end type safety)
- **Database:** Prisma 7 ORM + Supabase (PostgreSQL)
- **Environment:** T3 Env (type-safe env validation)
- **Authentication:** Spotify OAuth (PKCE flow)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── trpc/         # tRPC API handler
│   ├── layout.tsx         # Root layout (providers, metadata)
│   └── page.tsx           # Landing page
├── components/
│   ├── providers/         # React context providers
│   └── ui/                # shadcn/ui components
├── config/                # App configuration
├── env.ts                 # T3 Env - environment variable validation
├── generated/             # Prisma generated client (gitignored)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and shared code
│   ├── prisma.ts         # Prisma client singleton
│   ├── trpc.ts           # tRPC client configuration
│   └── utils.ts          # General utilities
├── server/
│   ├── routers/          # tRPC route handlers
│   │   └── health.ts     # Health check endpoints
│   └── trpc/
│       ├── init.ts       # tRPC initialization
│       └── router.ts     # Root router
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20.19+ (required for Prisma 7)
- npm 9.x or higher
- A Supabase account (free tier works)
- A Spotify Developer account

> **Note:** This project uses nvm. Run `nvm use` to automatically switch to the correct Node version.

### 1. Clone and Install

```bash
git clone <repository-url>
cd viberx
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string (pooled) |
| `DIRECT_URL` | Supabase direct connection (for migrations) |
| `SPOTIFY_CLIENT_ID` | Your Spotify app's Client ID |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app's Client Secret |
| `SPOTIFY_REDIRECT_URI` | OAuth callback URL |
| `AUTH_SECRET` | Session encryption secret |
| `ADMIN_PASSWORD` | Admin panel password (dev only) |

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Biome |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## Architecture Decisions

### Why tRPC?

tRPC provides end-to-end type safety between client and server without code generation or schemas. When you change a server procedure, TypeScript immediately catches any client code that needs updating.

### Why Prisma?

Prisma offers:
- Type-safe database queries with full autocomplete
- Automatic migrations and schema management
- Works seamlessly with TypeScript
- Easy integration with Supabase PostgreSQL

### Why Biome?

Biome replaces both ESLint and Prettier with a single, much faster tool. It's written in Rust and provides:
- Linting
- Formatting
- Import sorting
- All in one pass, much faster than ESLint + Prettier

### Why T3 Env?

T3 Env provides type-safe environment variables with build-time validation:
- **Build-time validation:** Missing or invalid env vars fail the build with clear errors
- **Type safety:** Full TypeScript inference when accessing `env.DATABASE_URL`
- **Security:** Clear separation between server and client variables
- **Documentation:** Schema serves as documentation for required variables

```typescript
// Usage - fully type-safe
import { env } from '@/env'
console.log(env.DATABASE_URL) // string, validated
console.log(env.SPOTIFY_CLIENT_ID) // string, validated
```

### Folder Structure Philosophy

- **`app/`**: Routes and pages only, minimal logic
- **`components/`**: Reusable UI components
- **`server/`**: All server-side code (tRPC, utilities)
- **`lib/`**: Shared utilities and configurations
- **`hooks/`**: Custom React hooks

## Development Workflow

### Git Strategy

- `main`: Production-ready code
- `dev`: Active development
- Feature branches: `checkpoint-1`, `checkpoint-2`, etc.

### Before Committing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Fix any issues
npm run lint:fix
```

## Checkpoint Progress

- [x] Checkpoint 1: Project Setup & Architecture
- [x] Checkpoint 1.5: Database Setup (Supabase + Prisma)
- [x] Checkpoint 2: Design System & Branding
- [x] Checkpoint 3: Spotify Authentication
- [ ] ~~Checkpoint 4: Fetch & Display Playlists~~ (project paused)
- [ ] ~~Checkpoint 5: Playlist Analysis~~ (blocked — audio features API restricted)
- [ ] ~~Checkpoint 6: Algorithmic Optimization Engine~~
- [ ] ~~Checkpoint 7: Manual Tweaking & Playlist Creation~~
- [ ] ~~Checkpoint 8: Dashboard & History~~
- [ ] ~~Checkpoint 9: Polish & Deployment~~

## Troubleshooting

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct in `.env`
2. Check Supabase dashboard for connection string
3. Ensure you're using the "Transaction pooler" connection string
4. Run `npm run db:studio` to test connection

### Prisma Issues

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate types
npm run type-check
```

### Environment Variable Errors

If you see "Invalid environment variables" during build:

1. Check that all required variables are in your `.env` file
2. Verify the format matches the schema in `src/env.ts`
3. For development without real credentials, set `SKIP_ENV_VALIDATION="true"`

```bash
# To skip validation temporarily (development only)
SKIP_ENV_VALIDATION=true npm run dev
```

## License

Private - All rights reserved.
