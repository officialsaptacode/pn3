# SaptaSMS — Project Status

Last updated: 2026-10-09 · Branch: `feat/ai-sms-wrapper` · PR: [#6](https://github.com/officialsaptacode/pn3/pull/6)

## Completed

### Backend (NestJS + BullMQ)
- [x] Prisma models: `Campaign`, `SmsJob`, `SmsTemplate` (with `layaScore`, `isApproved`, row counters)
- [x] BullMQ queue wired for AkashSMS at max 50 jobs/sec
- [x] `POST /api/sms/templates` — System 2 draft enhancement (`gpt-4o-mini`)
- [x] `POST /api/sms/templates/:id/evaluate` — System 1 compliance via self-hosted Laya (`$LAYA_BASE_URL/v1/systemone`, choice-type question, calibrated score → `isApproved`)
- [x] `POST /api/sms/presigned-url` + `POST /api/sms/campaigns` — browser→S3 CSV, queue fan-out
- [x] Admin reads (all `ADMIN`-role guarded): `GET /api/sms/admin/overview`, `/admin/templates`, `/admin/campaigns`, `/admin/campaigns/:id` (validated query DTOs, paginated, capped at 100)
- [x] Fixed server build breaks: `sms.processor.ts` unknown-error, `test-setup.ts` build exclusion
- [x] `prisma/seed.ts` (`pnpm db:seed`) — ADMIN + manager users, 2 templates, 1 campaign with 3 jobs (2 SENT / 1 FAILED); verified live against Neon

### Web (Next.js, English-only, static)
- [x] Campaign studio: 4-step ledger flow with progress strip, live SMS preview, compliance stamp, S3 upload, launch + success page
- [x] Templates library (search, copy, use-in-studio) and launch activity ledger (device-local until list endpoints are manager-scoped)
- [x] Landing with interactive SMS demo, product shell, sitemap
- [x] Removed news-portal boilerplate (25 paths) and the `next-intl`/Nepali stack — all routes prerender static
- [x] Fixed `/` + `/about` 500 (`useTranslations` inside async RSC `Sidebar`)
- [x] Design-review pass: 9 fixes (locked-state dimming, `enabled:hover`, focus-visible ring, Devanagari-safe line-height, safe `decodeURIComponent`, duplicate-icon removal)

### Admin (Vite + TanStack Router)
- [x] SMS section: campaigns table (progress %), campaign detail (delivery cards + latest 20 failures), templates table (approval stamps) + sidebar nav
- [x] `smsService` + types in `@workspace/api-client`
- [x] Fixed admin dev/build blockers: tiptap v3 `BubbleMenu` import path, dropped `framer-motion` for plain CSS

### Verified live
- [x] Admin login (`admin@saptasms.com`), overview counts match seed
- [x] Laya end-to-end: fresh template scored **0.238 → Approved** (real calibrated score, not mock/fail-safe)

## Remaining (must-do)

- [ ] **Start Redis locally** (`docker run -p 6379:6379 redis`) — campaign launch fails at enqueue time without it; `ECONNREFUSED 6379` still loops in Nest logs
- [ ] Set `OPENAI_API_KEY` (template enhancement currently passes text through unedited) and `DRY_RUN` in `apps/server/.env`
- [x] Commit + push remaining batches to PR #6 (scaffolds included — required for green builds)
- [x] Untracked scaffolds committed with the batch (`packages/*`, `.env.example` — required for green builds)
- [ ] Confirm the mystery second database is decommissioned (a `probe@saptasms.com` test row was created in it during diagnostics)
- [x] Fix `routeTree.gen.ts` CRLF status noise (root `.gitattributes` pins it to LF)
- [ ] Repair server Jest harness (`test-setup.ts` references nonexistent `test/api/mocks`) and add specs for the new admin reads
- [x] Move web auth token from `localStorage` to httpOnly cookie session (server sets `accessToken` cookie; studio uses sign-in form + profile probe)
- [x] Admin bundle warning: `React.lazy` split recharts (331 KB) + tiptap (510 KB) on demand; main chunk 1.66 MB → 822 KB

## Additional features (future)

- [ ] **UCS-2 segment counter** — the 160/153-char math assumes GSM-7; Devanagari SMS content needs 70/67-char segments or cost estimates mislead
- [ ] Retry-failed-jobs button in admin campaign detail (needs `POST /api/sms/admin/campaigns/:id/retry`)
- [ ] Approve/reject templates from the admin panel (needs `PATCH /api/sms/admin/templates/:id`)
- [ ] Live send progress (WebSocket or polling) on campaign detail + web activity page
- [ ] Scheduled campaigns (`send_at` + BullMQ delayed jobs)
- [ ] Per-campaign cost estimator (segments × rows × rate)
- [ ] SMS opt-out / blacklist management
- [ ] AkashSMS delivery webhooks → job status reconciliation
- [ ] Manager-scoped list endpoints so the web activity page shows real history instead of device-local data
- [ ] Audit log for admin actions (approvals, retries, role changes)
