# VibeRX - Decisions & Impact Log

Tracks architectural decisions, external platform changes, and their impact on the product. Newest entries first.

---

## DEC-004: Spotify Audio Features Access Risk

**Date:** 2026-02-11
**Status:** RISK — needs testing

**Context:**
In November 2024, Spotify announced that new Web API apps can no longer access:
- Audio Features (`GET /audio-features/{id}`)
- Audio Analysis (`GET /audio-analysis/{id}`)
- Recommendations
- 30-second preview URLs

Audio features (BPM, key, energy, danceability) are the core of VibeRX's playlist optimization. Without them, the app can't analyze tracks for DJ-style reordering.

**What we know:**
- The endpoints still technically exist in the API
- Existing apps with extended quota access are unaffected
- It's unclear whether dev mode apps can still access these for the developer's own data
- Extended quota approval is very competitive (~5% acceptance rate per Spotify's April 2025 post)

**Decision:**
Continue building as planned. Test audio features access as soon as OAuth is working with the new Spotify app. Do not redesign prematurely.

**Fallback options if blocked:**
1. Apply for extended quota with a working demo (auth + playlist UI + optimization algorithm ready, just needs data source)
2. Use MusicBrainz as an alternative BPM/key data source (free, open, but variable coverage)
3. Allow users to manually tag track attributes (functional but less magical)
4. Hybrid approach: pull from MusicBrainz where available, allow manual overrides for gaps

**Impact:** Potentially high — could require rethinking the core feature. Testing priority is critical.

**References:**
- https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
- https://developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access

---

## DEC-003: Spotify Feb 2026 API Changes — Schema & Auth Updates

**Date:** 2026-02-11
**Status:** Implemented

**Context:**
Spotify's February 2026 API changes removed several fields and renamed endpoints. These changes went into effect 2026-02-11.

**Fields removed from `/me` response:**
- `email`, `country`, `product`, `followers`, `explicit_content`

**Fields removed from track objects:**
- `popularity`, `available_markets`, `external_ids`

**Endpoint renames:**
- `/playlists/{id}/tracks` → `/playlists/{id}/items`
- `POST /users/{id}/playlists` → `POST /me/playlists`

**Decision:**
Updated schema and code immediately:
- Removed `email`, `country`, `product` from Prisma User model
- Removed those fields from `SessionUser` and `SpotifyUserProfile` types
- Removed `user-read-email` and `user-read-private` OAuth scopes
- Updated callback route and dashboard UI

**Impact:** Low — these were nice-to-have display fields, not core functionality. Future playlist endpoints will use the new `/items` paths.

**References:**
- https://developer.spotify.com/documentation/web-api/references/changes/february-2026

---

## DEC-002: Spotify Developer Platform Restrictions

**Date:** 2026-02-11
**Status:** Accepted

**Context:**
Spotify tightened developer access effective 2026-02-11:
- Dev mode requires Spotify Premium
- Max 5 authorized users per Client ID (down from 25)
- One Client ID per developer in dev mode
- HTTP redirect URIs blocked (except loopback `http://127.0.0.1`)

To serve unlimited users, apps must apply for Extended Quota Mode, which requires:
- A working demo
- Spotify team review
- OAuth scopes locked after approval

**Decision:**
- Use `http://127.0.0.1:3000/api/auth/callback` for local development
- Use `https://<domain>/api/auth/callback` for production
- Build and test within 5-user dev mode limit
- Apply for extended quota once the app has a complete demo

**Impact:** Local development workflow change (use `127.0.0.1` not `localhost`). Launch timeline depends on extended quota approval.

**References:**
- https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security
- https://developer.spotify.com/blog/2025-02-12-increasing-the-security-requirements-for-integrating-with-spotify

---

## DEC-001: Deployment & Infrastructure Setup

**Date:** 2026-02-11
**Status:** Implemented

**Context:**
Initial deployment to Vercel revealed build issues:
1. Prisma 7's `env()` helper throws if `DIRECT_URL` is missing (even for `prisma generate` which doesn't need a DB connection)
2. Prisma 7's default "client" engine requires a driver adapter
3. `next-pwa` package was deprecated and caused npm warnings
4. Next.js 16 renamed `middleware.ts` to `proxy.ts`

**Decisions:**
- Use `process.env` with fallback chain in `prisma.config.ts` instead of Prisma's strict `env()` helper
- Added `@prisma/adapter-pg` driver adapter for Prisma 7 compatibility
- Removed `next-pwa` entirely (PWA support deferred to Checkpoint 9 with a modern package)
- Migrated `middleware.ts` → `proxy.ts` per Next.js 16 convention

**Impact:** Clean builds on Vercel. PWA installability temporarily lost (was not functional anyway).
