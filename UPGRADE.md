# UPGRADE.md — SaaS Factory Roadmap
> All remaining work to take this boilerplate from "good" to "production-grade SaaS factory".

---

## 🔴 CRITICAL — Fix Before Any Project Launches

### Backend (apps/server)
- [ ] **Prisma 7 Migration**: `schema.prisma` `url = env("DATABASE_URL")` was temporarily removed to unblock generation. Move it to `prisma.config.ts` properly per Prisma 7 spec (`adapter` + `accelerateUrl`). See: https://pris.ly/d/prisma7-client-config
- [ ] **`apps/server/.env.example`**: Create this file. Currently `.env` is manually written. CLI cannot copy it if it doesn't exist.
- [ ] **NestJS Build fails** after Prisma generate. Root cause: `src/test-setup.ts` imports `../test/api/mocks` which doesn't exist. Either create the mocks file or remove the import.
- [ ] **Node version mismatch**: `package.json` requires `node >= 24.12.0`, system is on `v22.15.0`. Update engine requirement or document `nvm use 24` as a prerequisite.
- [ ] **`pnpm.overrides` deprecation**: Move pnpm overrides from root `package.json` to `pnpm-workspace.yaml` `catalog:` per pnpm v10 spec.

### Admin App (apps/admin)
- [ ] **TipTap `BubbleMenu` missing export**: `@tiptap/react@3.23.4` no longer exports `BubbleMenu`. Update `src/components/tip-tap/components/BubbleMenu.tsx` to import from `@tiptap/extension-bubble-menu` or remove if unused.
- [ ] **Trips feature stubs**: `apps/admin/src/routes/_auth/trips/` was deleted because it imported from non-existent `@/features/trips/api/use-trips`. Recreate the `useTrips` / `useTrip` / `useCreateTrip` / `useUpdateTrip` / `useDeleteTrip` hooks in `apps/admin/src/features/trips/api/`.

### Web App (apps/web)
- [ ] **Next.js `middleware.ts` → `proxy.ts`**: Already renamed. Verify the contents work correctly with the new convention. See: https://nextjs.org/docs/messages/middleware-to-proxy

---

## 🟡 AUTH SYSTEM UPGRADE

Current state: **Custom JWT + Argon2 (NestJS)** — works but you own the maintenance.

### Option A: Self-Hosted (Free) — Recommended for Solopreneur
- [ ] **Migrate to [Lucia Auth](https://lucia-auth.com/)**: Drop-in session management, works with Prisma + Neon Postgres. Zero cost, zero vendor lock-in. Delete `apps/server/src/auth/strategy/` and replace with Lucia sessions.
- [ ] **Or: [Better Auth](https://www.better-auth.com/)**: Framework-agnostic, NestJS adapter available. Supports Organizations, RBAC, 2FA out of the box — free.

### Option B: Managed (Free Tier Exists)
- [ ] **[Supabase Auth](https://supabase.com/auth)**: Free tier covers most SaaS starts. Has RLS, Organizations. Replaces custom JWT entirely.

### Immediate Auth Fixes (regardless of option chosen)
- [ ] **AT expiry is 150 minutes** (`60 * 15 * 10` in `auth.service.ts` line 130). Looks like a typo — intended `15 minutes`. Fix or document.
- [ ] **`roles.guard.ts` lacks a default deny**: If `@Roles()` decorator is missing, the guard passes. Should default to deny unless explicitly allowed.
- [ ] **No rate limiting on `/auth/signin`**: Brute force protection is missing. `@nestjs/throttler` is already installed — add a stricter TTL on the auth controller.
- [ ] **Password reset flow**: Not implemented. Users cannot recover accounts.
- [ ] **Email verification**: Not implemented. Anyone can register with any email.

---

## 🟠 CLI UPGRADE (packages/cli)

Current state: `packages/cli/index.js` — minimal, zero-dependency, works.

- [ ] **Interactive feature flags** via `prompts` package:
  - `Include CMS/Blog? (yes/no)` — strips `apps/admin/src/routes/_auth/blogs/` if no
  - `Include Trip/Booking module? (yes/no)` — controlled by trips feature
  - `Payment gateway? (Stripe / LemonSqueezy / None)`
- [ ] **Brand injection across ALL files**: Currently only rewrites root `package.json`. Should also replace `"pn3"` strings in all `apps/*/package.json`, `turbo.json`, and `prisma/schema.prisma` `@@map` tables.
- [ ] **Auto-generate secrets**: Generate `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY` using `crypto.randomBytes(64).toString('hex')` and write to `.env` automatically.
- [ ] **`npx` support**: Publish to npm as `create-shadow-app` so teams can run `npx create-shadow-app` without cloning this repo. Add `"files": ["index.js"]` to `packages/cli/package.json`.
- [ ] **Latest package versions**: After clone, run `npx npm-check-updates -u && pnpm install` automatically inside the CLI instead of printing instructions.
- [ ] **CLI update check**: Warn if the cloned template is older than 30 days (check `git log -1 --format=%ct` on the remote).

---

## 🟢 BOILERPLATE QUALITY

### Admin App
- [ ] **Reduce cognitive complexity** in `settings/landing-page.tsx` (score 23, max 15). Extract the `useEffect` into smaller helpers.
- [ ] **Remove unused imports** (biome reports 35 errors / 152 warnings). Run `pnpm -C apps/admin biome check --write .` to auto-fix safe ones.
- [ ] **`destination-selector.tsx`**: `isLoading` variable unused (line 26). Remove it.
- [ ] **`navbar-builder.tsx`**: Replace `acc[groupName]!.push()` with `acc[groupName]?.push()`.

### Web App
- [ ] **Replace `<img>` with `<Image />`** in `apps/web/src/app/[locale]/article/[slug]/page.tsx` line 115 for LCP performance.
- [ ] **Reduce cognitive complexity** in `ContactForm` (score 32) and `ArticlePage` (score 22). Extract locale branching into a shared `useLocale()` hook.

### API Client (packages/api-client)
- [ ] **Add Zod response validation**: Currently raw axios with no runtime type checking. Add Zod schemas to `@workspace/api-client` so the admin app gets validated responses.

---

## 🔵 DEVOPS & DEPLOYMENT

- [ ] **`render.yaml`**: Create deployment blueprint for Render (NestJS server). Include `DATABASE_URL`, `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY` as env groups.
- [ ] **`vercel.json`**: Add for both `apps/web` and `apps/admin`. Set `buildCommand`, `outputDirectory`.
- [ ] **GitHub Actions**: Add CI workflow — `pnpm install && pnpm build && pnpm lint` on every PR to `main`.
- [ ] **Docker**: Add `apps/server/Dockerfile` for Render deployment. Multi-stage: build → runtime.
- [ ] **Database**: Replace dummy `DATABASE_URL` in `.env` with Neon Postgres connection. Neon free tier is enough to start.

---

## 📅 Suggested Order

1. Fix CRITICAL items (Prisma, missing mocks, NestJS build)  
2. Auth hardening (rate limiting, AT expiry fix, roles guard)  
3. Admin lint/quality cleanup  
4. CLI brand injection + secret generation  
5. render.yaml + vercel.json + GitHub Actions  
6. Consider Lucia/Better Auth migration when scaling to 2+ clients  
