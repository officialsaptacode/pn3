# Boilerplate Fixes & Enterprise Auth Upgrade Plan

## 1. Bug Fixes (Boilerplate Stabilization)
- **Backend (NestJS)**: The build fails because the Prisma Client isn't generated in `apps/server/src/generated`. We need to add a prebuild script or run `prisma generate` to fix type errors.
- **Admin App (React/Vite)**: 
  - Fix TanStack Router generator errors in `apps/admin/src/routes/_auth/destinations` (the route IDs are malformed).
  - Remove or fix the missing `useTrips` import in `apps/admin/src/routes/_auth/trips/index.tsx`.
  - Fix linting warnings (e.g., unused imports, cognitive complexity).
- **Web App (Next.js)**: Resolve the Next.js 16.2.1 warning by migrating `middleware.ts` to `proxy.ts`.

## 2. Enterprise Auth Upgrade (The "Close This and Auth" Solution)
To get a passport-grade, solopreneur-friendly enterprise auth setup without maintaining custom JWT logic, we will replace the manual Argon2/JWT system with **Clerk** (or Supabase Auth). This gives us:
- Out-of-the-box B2B/Enterprise features (SSO, SAML, Organizations).
- Built-in UI components for Next.js (`apps/web`) and React (`apps/admin`).
- Secure session management that requires zero maintenance.

### Implementation Steps:
1. **Remove Custom Auth**: Delete the JWT logic in `apps/server/src/auth` and the manual auth endpoints.
2. **Frontend Integration**: Install `@clerk/nextjs` in `apps/web` and `@clerk/clerk-react` in `apps/admin`. Wrap both apps in Clerk Providers.
3. **Backend Integration**: Install `@clerk/clerk-sdk-node` in the NestJS server. Update the AuthGuard to verify Clerk session tokens instead of custom JWTs.
4. **Database Sync**: Sync Clerk users to the Neon Postgres database via Clerk Webhooks.
