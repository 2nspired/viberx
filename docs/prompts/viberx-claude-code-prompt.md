# VibeRX - Claude Code Project Prompt

I'm building a Spotify playlist optimizer web app called "VibeRX" that reorganizes playlists like a professional DJ set using BPM, key, and energy analysis. I'm a junior developer and want to learn throughout this process.

## Tech Stack

- Next.js 16+ (App Router)
- React
- TypeScript
- Tailwind CSS
- Biome (instead of Prettier)
- shadcn/ui components
- tRPC for API layer
- Prisma ORM 4+ (database layer)
- Supabase (PostgreSQL database + future auth)
- Vercel Analytics (free tier)
- Spotify Web API
- Deployment: Vercel

## Platform Support

This app must work seamlessly on:
- **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile web browsers** (iOS Safari, Chrome Mobile, Samsung Internet)
- Responsive design is critical - optimize for mobile-first approach
- Touch interactions must work alongside mouse/keyboard
- Consider mobile data usage and performance

**Design Considerations:**
- Touch targets minimum 44x44px (Apple's guideline)
- Mobile navigation (consider bottom nav or hamburger menu)
- Drag-and-drop must work with touch gestures
- Card layouts should stack nicely on mobile
- Test pill-shaped buttons for mobile usability
- Ensure text remains legible on small screens

## Progressive Web App (PWA)

Since this is mobile web focused, configure as a PWA so users can install VibeRX on their home screens:
- Add manifest.json with VibeRX branding (icon, name, colors)
- Configure service worker for offline capability (at minimum, cache the UI shell)
- Make the app installable on iOS and Android
- Add appropriate meta tags for mobile browsers
- Configure splash screens and app icons

**Note:** Don't over-engineer the PWA features in Phase 1 - basic installability is sufficient. Full offline support can come later.

## Security Best Practices

**Token Security:**
- Store Spotify tokens in httpOnly cookies (not localStorage)
- Encrypt refresh tokens at rest
- Implement CSRF protection for auth routes
- Set appropriate cookie SameSite attributes

**Environment Variables:**
- Never commit .env files to git
- Use different Spotify apps for dev/production
- Rotate secrets periodically
- Document which variables are required vs optional

**Database Security:**
- Use Supabase Row Level Security (RLS) policies
- Never expose DATABASE_URL in client-side code
- Validate all user inputs before database queries
- Use Prisma's parameterized queries (built-in protection)

## Database & ORM

**Prisma ORM 4+ with Supabase PostgreSQL:**
- Use Prisma as the type-safe database layer
- Supabase provides the PostgreSQL database (free tier)
- Prisma Schema should include (initially):
  - User model (for future auth and preferences)
  - OptimizedPlaylist model (to track optimization history)
  - CachedAudioFeatures model (cache Spotify audio analysis)
  - UserPreferences model (for saved settings)
- Use Prisma Client in tRPC routes for database operations
- Leverage Prisma's type safety with TypeScript
- Set up proper indexing for performance

**Phase 1 Database Needs:**
- Store optimization history (playlist ID, settings used, timestamp)
- Track which playlists have been optimized
- Cache Spotify audio analysis data (to avoid re-fetching and save API rate limits)
- User preferences (optimization presets, UI settings)

**Note:** Keep schema simple in Phase 1. We can extend it in Phase 2 for payment tracking and AI usage limits.

## Development Workflow

**Git Strategy:**
- Main branch: production-ready code
- Dev branch: active development
- Feature branches: checkpoint-1, checkpoint-2, etc.
- Commit after each checkpoint approval
- Write descriptive commit messages

**Local Development:**
- Use `npm run dev` for hot reloading
- Use `npx prisma studio` to inspect database
- Test on localhost:3000 (desktop) and local IP (mobile)
- Use browser DevTools for responsive testing

**Code Quality:**
- Run Biome before committing: `npm run lint`
- Type check with `npm run type-check`
- Format code consistently
- Review Biome suggestions and fix issues

## Rate Limiting & API Quotas

**Spotify API Limits:**
- Rate limit: ~180 requests per minute (varies by endpoint)
- Audio features: Max 100 tracks per request
- Playlist tracks: Max 100 tracks per request
- Strategy: Implement exponential backoff for 429 (rate limit) errors

**Implementation:**
- Add retry logic with exponential backoff in Spotify API calls
- Show progress indicators for large playlists
- Cache aggressively to minimize API calls
- Consider queuing large operations

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth per month
- 50,000 monthly active users
- Monitor usage in Supabase dashboard

## Project Scope - Phase 1 (MVP)

Build this in CHECKPOINTS so I can review, ask questions, and approve before continuing:

### CHECKPOINT 1: Project Setup & Architecture

- Initialize Next.js project with TypeScript
- Install and configure: Tailwind, Biome, shadcn/ui, tRPC
- **Set up Prisma ORM 4+:**
  - Initialize Prisma with PostgreSQL provider (Supabase)
  - Create initial schema file structure
  - Configure Prisma Client
  - Prepare for database connection (will configure in next checkpoint)
- Set up Geist font with Next.js font optimization
- Set up folder structure following Next.js 16 App Router best practices
- Configure PWA basics (manifest.json, meta tags)
- Create .env.example with all needed environment variables (including DATABASE_URL, Spotify credentials)
- Set up Vercel Analytics
- Add detailed README with setup instructions (including Prisma migration commands)

**PAUSE HERE** - Explain the architecture decisions, folder structure, PWA setup, Prisma setup, and why you chose this setup. Explain how Prisma works with tRPC and Next.js. Wait for my approval.

### CHECKPOINT 1.5: Database Setup (Supabase + Prisma)

**Supabase Project Setup:**
- Guide me through creating a Supabase project
- Explain how to get the DATABASE_URL (PostgreSQL connection string)
- Show me where to find it in the Supabase dashboard
- Explain Supabase's free tier limits and what to watch out for

**Prisma Schema Design:**
Create initial Prisma schema with these models:

1. **User Model:**
   - id (Spotify user ID as primary key - string)
   - spotifyId (string, unique)
   - displayName (string, nullable)
   - email (string, nullable)
   - profileImage (string, nullable)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: optimizedPlaylists, preferences

2. **OptimizedPlaylist Model:**
   - id (auto-increment)
   - userId (foreign key to User)
   - spotifyPlaylistId (string, the new playlist created)
   - originalPlaylistId (string, the source playlist)
   - playlistName (string)
   - optimizationSettings (JSON - stores BPM/key/energy weights and mode)
   - trackCount (int)
   - createdAt (DateTime)
   - Relations: user

3. **CachedAudioFeatures Model:**
   - id (auto-increment)
   - spotifyTrackId (string, unique, indexed)
   - trackName (string)
   - artistName (string)
   - bpm (float, nullable)
   - key (int, nullable)
   - energy (float, nullable)
   - valence (float, nullable)
   - danceability (float, nullable)
   - duration_ms (int)
   - cachedAt (DateTime)

4. **UserPreferences Model (optional for Phase 1, can add later):**
   - id (auto-increment)
   - userId (foreign key to User, unique)
   - defaultOptimizationMode (string, default "auto")
   - preferredWeights (JSON, nullable)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: user

**Prisma Setup Tasks:**
- Define the complete schema with proper relations and indexes
- Create initial migration with `prisma migrate dev`
- Generate Prisma Client with `prisma generate`
- Set up Prisma Client singleton in `lib/prisma.ts` (prevents multiple instances)
- Test database connection
- Optionally add database seed script for testing

**Documentation:**
- Add Prisma commands to README:
  - `npx prisma migrate dev` (create and apply migrations)
  - `npx prisma generate` (regenerate Prisma Client after schema changes)
  - `npx prisma studio` (open database GUI for manual inspection)
  - `npx prisma db push` (for prototyping without migrations)
- Document the schema relationships and why each field exists
- Explain indexing strategy for performance (spotifyTrackId index on CachedAudioFeatures)

**PAUSE HERE** - Show me:
1. The complete Prisma schema with helpful comments
2. The Prisma Client singleton setup (`lib/prisma.ts`)
3. Step-by-step Supabase setup instructions with screenshots/descriptions
4. Explain the database design decisions and relationships
5. Show me how to run the first migration and verify it worked
6. Demonstrate `prisma studio` to view the empty tables

Wait for my approval before proceeding to design system.

### CHECKPOINT 2: Design System & Branding (VibeRX Identity)

Set up a custom design system that makes VibeRX visually distinctive while remaining maintainable:

**Brand Aesthetic:** Clean, minimal with clinical precision (think FDA nutrition labels) meets music app energy. "Spotify meets modern pharmacy."

**Color Palette:**
- Primary: Deep purple or electric blue (music app energy, NOT medical blue)
- Accent: Neon green, hot pink, or orange (vibrant pops of color)
- Background: Dark mode primary with clean white/light cards for contrast
- Avoid traditional medical blue/white (too hospital-like)

**Typography:**
- Use Geist font (with Helvetica as fallback)
- Clean, legible hierarchy inspired by prescription labels
- Different font weights for emphasis (like bold drug names on prescriptions)

**Custom UI Elements:**
- Pill-shaped buttons (rounded-full, playing on the RX theme)
- Progress bars styled like medicine dosage indicators
- Playlist cards designed like prescription labels (clean boxes with clear info hierarchy)
- Color-coded energy/BPM indicators (gradients are okay)
- Waveform visualizations where appropriate

**Responsive Design:**
- Mobile-first approach (design for small screens, scale up)
- Breakpoints: mobile (default), tablet (768px), desktop (1024px)
- Touch-friendly interactions (larger tap targets minimum 44x44px, swipe gestures)
- Test all components at multiple screen sizes in admin design system
- Landing page must look great on mobile devices
- Mobile navigation pattern (hamburger or bottom nav)

**Global CSS Variables:**
- Extend shadcn/ui's existing CSS variables in `globals.css`
- Add custom variables for:
  - Brand colors (primary, accent, gradients)
  - Spacing for pill-shaped elements
  - Custom shadows/glows for neon accents
  - Prescription label styling (borders, backgrounds)
- Keep all theming centralized using CSS variables for easy adjustments

**Implementation Tasks:**

1. **Tailwind Configuration:**
   - Add custom color palette
   - Configure Geist font
   - Set up dark mode as default
   - Configure responsive breakpoints

2. **Extend globals.css:**
   - Build on shadcn/ui's existing CSS variables
   - Add VibeRX-specific variables (colors, spacing, effects)
   - Document all custom variables with comments

3. **Create Component Variants:**
   - Button: Create 2-3 pill-shaped variants (primary, outline, ghost) - test on mobile
   - Card: Design 2-3 prescription label card variants (minimal, detailed, compact) - mobile responsive
   - Badge: Energy/BPM indicator badges with color coding
   - Progress: Dosage-style progress bars

4. **Landing Page:**
   - Hero section with VibeRX branding (mobile and desktop)
   - Showcase "prescription for perfect playlists" concept
   - Use pill-shaped CTAs (touch-friendly)
   - Display color palette and typography in action
   - Include at least one prescription-style playlist card example
   - Simple, clean layout establishing the visual language
   - Fully responsive across all screen sizes

5. **Admin Design System Route (`/admin/design-system`):**
   - **Protection:** Dev mode only (accessible when `NODE_ENV=development`)
   - **Additional Auth:** Simple hardcoded password check for extra security (use env variable)
   - **Storybook-Style Showcase:**
     - Display all custom component variants with live examples
     - Show code snippets for each component (copy-paste ready)
     - Color palette swatches with hex codes and CSS variable names
     - Typography scale examples with sizing
     - Spacing/layout utility demonstrations
     - Interactive component state examples (hover, active, disabled, focus)
     - Live theme color picker to test combinations
     - CSS variable reference table
     - **Responsive testing:** Show components at different breakpoints with viewport simulator
   - Organized by categories: Colors, Typography, Components, Layouts, Responsive
   - Clean, searchable interface

6. **Accessibility:**
   - Ensure proper ARIA labels for interactive elements
   - Keyboard navigation support (tab order, focus states)
   - Screen reader compatibility (semantic HTML)
   - Color contrast meets WCAG AA standards (check with tools)
   - Focus indicators visible on all interactive elements
   - Alt text for all images

**PAUSE HERE** - Show me:
1. The landing page design (desktop and mobile views)
2. The `/admin/design-system` route with all components showcased
3. The `globals.css` with custom variables and detailed comments
4. Multiple component variants for buttons and cards
5. PWA manifest and icons
6. Explain how to add/modify components and colors going forward
7. Demonstrate responsive behavior at different breakpoints
8. Show me how to access the admin route and test the password protection

Wait for my approval before proceeding.

### CHECKPOINT 3: Spotify Authentication

- Implement Spotify OAuth flow (PKCE for web apps - Authorization Code with Proof Key for Code Exchange)
- Create login page with VibeRX branding (mobile responsive)
- Create OAuth callback handler route
- Store access/refresh tokens securely (httpOnly cookies or encrypted session)
- **Database Integration:**
  - Create or update User record in database on successful login
  - Store Spotify user ID, display name, profile image
  - Use Prisma to upsert user data
- Create a simple protected dashboard route that shows "Logged in as [username]" with profile image
- Add logout functionality (clear tokens and session)
- Ensure auth flow works on mobile browsers (test on iOS Safari especially)
- Add middleware to protect routes that require authentication

**PAUSE HERE** - Explain:
1. How Spotify OAuth PKCE flow works (step-by-step with diagrams/descriptions)
2. Token management strategy and security considerations
3. Why PKCE is important for browser-based apps
4. How to create a Spotify Developer app and get credentials
5. Where to set redirect URIs in Spotify dashboard
6. How the database user upsert works
7. Session/cookie security best practices
8. Show me the login flow working on desktop and mobile

Wait for my approval.

### CHECKPOINT 4: Fetch & Display Playlists

- **Create tRPC endpoints:**
  - `playlists.getMyPlaylists` - fetch user's Spotify playlists
  - Handle pagination (Spotify returns 50 at a time)
  - Error handling for expired tokens (trigger refresh)
- Build dashboard UI using shadcn/ui (with VibeRX styling) to display playlists
- Display format: grid on desktop, stacked list on mobile
- Add loading states (skeletons using shadcn skeleton component)
- Add error handling with user-friendly messages
- Show playlist info:
  - Playlist name
  - Track count
  - Cover image (with fallback)
  - Owner name
  - Public/private indicator
- Use prescription card styling for playlist display
- Add search/filter functionality (optional but nice to have)
- Ensure grid/list layout works well on mobile (stack cards appropriately)

**PAUSE HERE** - Explain:
1. tRPC setup - how routes are defined and called
2. How the API routes work and where they live in Next.js App Router
3. Component structure and data flow
4. Spotify API pagination handling
5. Error boundary implementation
6. Show the playlist grid on desktop and mobile
7. Demonstrate loading states and error handling

Wait for my approval.

### CHECKPOINT 5: Playlist Analysis

- **Fetch detailed track info including audio features:**
  - Create tRPC endpoint `playlists.analyzePlaylist`
  - Accept playlist ID as input
  - Fetch playlist tracks from Spotify
  - Fetch audio features for all tracks (batch in groups of 100)
  - **Cache in database:** Check CachedAudioFeatures first, only fetch missing tracks
  - Store/update cached features with Prisma
- Display analysis results in a clean UI:
  - Show current track order with BPM/key/energy data
  - Color-code tracks by energy level
  - Show BPM distribution (consider a simple chart)
  - Display key distribution (Camelot wheel visualization optional)
- Implement efficient data fetching:
  - Batch requests to avoid rate limits
  - Show progress indicator for large playlists
  - Handle Spotify API rate limits gracefully
- Use color-coded indicators for energy/BPM
- Optimize for mobile data usage (cache aggressively)
- Make track list scrollable and touch-friendly on mobile
- Add sorting options (by BPM, energy, key, original order)

**PAUSE HERE** - Explain:
1. Spotify's Audio Features API - what each metric means:
   - BPM (tempo)
   - Key (0-11, musical key)
   - Energy (0-1)
   - Valence (0-1, musical positivity)
   - Danceability (0-1)
2. How we're fetching and batching requests
3. Database caching strategy with Prisma
4. The UI components for displaying track data
5. Performance optimizations for large playlists
6. Show the analysis view on desktop and mobile
7. Demonstrate the caching working (first load vs second load)

Wait for my approval.

### CHECKPOINT 6: Algorithmic Optimization Engine

- **Build the core algorithm that reorders tracks based on:**
  - **BPM transitions:** Gradual changes (e.g., 120 → 122 → 125), DJ-style flow
  - **Harmonic mixing:** Key compatibility using Camelot Wheel logic (compatible keys)
  - **Energy flow:** Smooth progression (can build up, wind down, or balance)
  
- **Create configurable settings:**
  - **Auto mode:** Algorithm decides best flow (balanced approach)
  - **Manual mode:** Sliders for BPM weight (0-100%), key weight (0-100%), energy weight (0-100%)
  - **Preset modes:**
    - "Energetic Build" (start low, build to high energy)
    - "Chill Vibes" (maintain low-medium energy throughout)
    - "Balanced Mix" (varied energy with smooth transitions)

- **Implementation:**
  - Create algorithm in a separate utility file with detailed comments
  - Use a scoring system to rank track orders
  - Consider multiple factors:
    - BPM difference between consecutive tracks (smaller = better)
    - Key compatibility (Camelot wheel adjacency)
    - Energy progression (based on mode)
  - Return optimized track order with explanation

- **UI Components:**
  - Settings panel with touch-friendly sliders (mobile)
  - Preset mode buttons (pill-shaped)
  - Before/after comparison view:
    - Side-by-side on desktop
    - Stacked with tabs on mobile
  - Visual indicators showing improvements (BPM flow chart, energy progression)
  - Explanation of why tracks were reordered

- **Ensure settings UI works well on mobile:**
  - Consider bottom sheet or modal for settings
  - Large touch targets for sliders
  - Clear visual feedback

**PAUSE HERE** - Explain:
1. The algorithm logic in detail with examples
2. Harmonic mixing theory and the Camelot Wheel
3. How scoring works and how we determine optimal order
4. Walk me through the code with detailed comments
5. Show the optimization settings UI on desktop and mobile
6. Demonstrate before/after comparisons with a real playlist
7. Explain tradeoffs between different optimization approaches

Wait for my approval.

### CHECKPOINT 7: Manual Tweaking & Playlist Creation

- **Add drag-and-drop interface to manually reorder optimized tracks:**
  - Use a library like `@dnd-kit/core` or `react-beautiful-dnd`
  - **CRITICAL:** Must work with touch gestures on mobile (long-press to drag)
  - Visual feedback during drag (elevation, highlight drop zones)
  - Smooth animations
  - Works with large playlists (virtualized list if needed)

- **Create "Save as New Playlist" functionality:**
  - tRPC endpoint `playlists.createOptimized`
  - Accept: track order, original playlist ID, custom name (optional)
  - Generate new playlist name: "[VibeRX] Original Name" or user's custom name
  - Create playlist via Spotify API with optimized order
  - **Save to database:** Create OptimizedPlaylist record with Prisma
  - Add all tracks to the new playlist (batch in groups of 100)
  
- **Success flow:**
  - Show success message with prescription-style confirmation UI
  - Include link to open playlist in Spotify
  - Option to "Optimize Another" or "View Dashboard"
  - Mobile responsive success screen

- **Error handling:**
  - Spotify API failures (permissions, rate limits)
  - Clear error messages
  - Retry options

**PAUSE HERE** - Explain:
1. The Spotify playlist creation API endpoints and flow
2. How drag-and-drop works (library choice and implementation)
3. How touch support works (especially on mobile)
4. State management for track reordering
5. Database operations with Prisma (saving optimization history)
6. Demo drag-and-drop on desktop and mobile
7. Show the complete flow: optimize → tweak → save → success

Wait for my approval.

### CHECKPOINT 8: Dashboard & History

- **Create comprehensive dashboard showing:**
  - **Hero section:** User profile info (from Spotify)
  - **Original Playlists section:** User's Spotify playlists (from Checkpoint 4)
  - **Optimized Playlists section:** Previously optimized playlists
    - Fetch from database (OptimizedPlaylist model)
    - Show: playlist name, original name, track count, optimization date
    - Marked with VibeRX prefix/badge
  - **Quick actions:** "Optimize New Playlist" button
  
- **Optimization History:**
  - List of past optimizations with details:
    - Original playlist → Optimized playlist
    - Settings used (mode, weights)
    - Timestamp
    - Track count
  - Click to view details or re-optimize
  - Option to re-optimize with different settings
  
- **Navigation:**
  - Mobile-friendly nav (bottom nav or hamburger menu)
  - Routes: Dashboard, History, Settings (future), Admin (dev only)
  - Smooth transitions between routes
  
- **Use Prisma to:**
  - Fetch optimization history (`optimizedPlaylists.findMany`)
  - Join with User data
  - Order by creation date (most recent first)
  - Paginate if many optimizations (10-20 per page)

- **Prescription card layout consistently across all views**

- **Mobile considerations:**
  - Bottom navigation bar with icons
  - Collapsible sections on mobile
  - Touch-friendly action buttons

**PAUSE HERE** - Explain:
1. The routing structure (App Router file organization)
2. How we track optimized playlists in the database
3. Prisma queries being used (with relations)
4. The overall user flow from login to optimization to history
5. Mobile navigation implementation and why you chose this pattern
6. Show the complete dashboard on desktop and mobile
7. Demonstrate clicking through history and re-optimizing

Wait for my approval.

### CHECKPOINT 9: Polish & Deployment

- **Polish UI/UX:**
  - Add loading skeletons for all async operations
  - Smooth transitions and animations (framer-motion optional)
  - Implement comprehensive error handling:
    - Network errors
    - Spotify API errors (rate limits, permissions)
    - Database errors
    - User-friendly error messages with prescription-style cards
  - Empty states (no playlists, no optimization history)
  - Success toast notifications

- **Analytics:**
  - Add Vercel Analytics tracking for key user actions:
    - Login/logout
    - Playlist optimization started
    - Playlist created
    - Settings changed
  - Track errors and performance

- **PWA Final Setup:**
  - Test PWA installation on iOS (Safari)
  - Test PWA installation on Android (Chrome)
  - Verify offline capability (at least UI shell loads)
  - Test splash screens and icons
  - Ensure app behaves correctly when installed

- **Performance Optimization:**
  - Optimize images (Next.js Image component)
  - Lazy load heavy components
  - Code splitting
  - Minimize bundle size
  - Database query optimization (add indexes if needed)

- **Testing:**
  - Test with various playlist sizes (small: 10 tracks, medium: 50 tracks, large: 200+ tracks)
  - Test with playlists containing:
    - Local files (should be handled gracefully)
    - Tracks without audio features
    - Duplicate tracks
    - Various genres (EDM, classical, hip-hop)
  - Test token refresh flow (simulate expired tokens)
  - Test on different devices and browsers
  - Test slow network conditions (throttle in DevTools)

- **Documentation:**
  - Write comprehensive deployment guide for Vercel:
    - Environment variables needed
    - Supabase setup steps
    - Spotify Developer app configuration
    - Build and deploy process
  - Document all environment variables in .env.example
  - Add troubleshooting section to README
  - Include screenshots of key setup steps

- **Final Checklist:**
  - All UI elements follow VibeRX design system
  - Mobile responsiveness across all pages
  - Touch interactions tested
  - Error states handled
  - Loading states present
  - Database migrations documented
  - TypeScript strict mode passing (no 'any' types)
  - Biome linting passing

**PAUSE HERE** - Review:
1. The entire app on desktop (demonstrate full user flow)
2. The entire app on mobile (demonstrate full user flow)
3. PWA installation process on iOS and Android
4. Deployment process and Vercel configuration
5. Environment variables and how to set them up
6. Database migrations and Prisma workflow
7. Performance metrics and optimizations made
8. What we built in Phase 1 and what's next for Phase 2

Final Q&A - I'll ask any remaining questions before we consider Phase 1 complete.

## Important Guidelines

- Use TypeScript strictly (no 'any' types unless absolutely necessary)
- Follow Next.js 16 App Router best practices
- Add helpful code comments explaining complex logic (especially for algorithms)
- Use shadcn/ui components with VibeRX custom styling
- Implement proper loading and error states everywhere
- Keep the UI clean, intuitive, and on-brand
- Make the code readable for a junior developer to learn from
- All custom styling should use CSS variables from globals.css
- **Mobile-first approach:** Build for mobile, enhance for desktop
- Test touch interactions throughout development
- **Prisma Best Practices:**
  - Always use Prisma Client in a singleton pattern (`lib/prisma.ts`)
  - Use transactions when updating multiple records
  - Leverage Prisma's type generation for full type safety
  - Include database queries in tRPC route comments for clarity
  - Add indexes for frequently queried fields
- **Handle Edge Cases:**
  - Empty playlists (no tracks to optimize)
  - Very large playlists (500+ tracks - consider pagination/virtualization)
  - Playlists with local files (Spotify doesn't provide audio features for these)
  - Tracks without audio features (handle gracefully, exclude or use defaults)
  - Duplicate tracks in playlists
  - Private/collaborative playlists (check permissions)
- **Logging Strategy:**
  - Use structured logging (consider pino or winston)
  - Log API errors with context (user ID, playlist ID, timestamp)
  - Never log sensitive data (tokens, passwords)
  - Add debug mode for development (verbose logging)
  - Use Vercel logs for production debugging

## Notes

- **Supabase Setup:** I'll need to create a Supabase project and get the DATABASE_URL
- **Spotify API credentials:** I'll need to create a Spotify Developer app and provide CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI
- Keep everything free-tier compatible (no paid services in Phase 1)
- Future phases will add:
  - **Phase 2:** AI optimization (Claude API), payment integration (Stripe), usage limits
  - **Phase 3:** YouTube playlist features (Spotify ↔ YouTube conversion)
- Admin design system route is dev-only with password protection for safety
- Focus on mobile web - no native apps planned
- Cache Spotify audio features aggressively to save API calls and improve performance

Please start with CHECKPOINT 1 and wait for my approval before proceeding to each next checkpoint.
