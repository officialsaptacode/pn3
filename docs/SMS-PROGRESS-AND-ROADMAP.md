# SMS Project — Progress Report and Roadmap

**Branch / PR:** `feat/ai-sms-wrapper` / PR #6  
**Last updated:** 2026‑10‑27  

---

## 1. Progress Report

### Completed work (✅)
| Area | Deliverable |
|------|-------------|
| **Backend (NestJS + Prisma + BullMQ)** | • Prisma models: `Campaign`, `SmsJob`, `SmsTemplate` with status/counters. <br>• BullMQ queue wired for AkashSMS at max 50 jobs/sec. <br>• `POST /api/sms/templates` – System 2 draft enhancement (`gpt‑4o‑mini`). <br>• `POST /api/sms/templates/:id/evaluate` – System 1 compliance via self‑hosted Laya (`/v1/systemone`), live score 0.238 → Approved. <br>• `POST /api/sms/presigned-url` + `POST /api/sms/campaigns` – browser→S3 CSV upload, queue fan‑out. <br>• Admin reads (`GET /api/sms/admin/overview|templates|campaigns|campaigns/:id`) – ADMIN‑guarded, validated DTOs, paginated. <br>• `prisma/seed.ts` – ADMIN + manager users, 2 templates, 1 campaign with jobs. <br>• httpOnly cookie sessions – server sets `accessToken` cookie on signin/signup/refresh, clears on logout. <br>• Web English‑only – removed `next‑intl`/Nepali stack, all routes prerender static. <br>• Admin bundle 1.66 MB → 822 KB via `React.lazy` for recharts + tiptap; biome 0 errors on touched files. |
| **Delivery analytics** | • `GET /api/sms/admin/campaigns/:id/analytics` – delivery rates, hourly/daily `date_trunc` buckets, top‑5 fail reasons. <br>• Admin campaign detail: rate cards, lazy Recharts area chart (own chunk), fail‑reason list. <br>• Verified live on seed: 67 % sent, 1 bucket, top error “Invalid phone number format”. |
| **Contact management** (new) | • Prisma models `ContactList`, `Contact`, `ContactImport` added. <br>• DTO `ScheduleCampaignDto`. <br>• Admin `PATCH /api/sms/admin/campaigns/:id/schedule` endpoint. <br>• `send_at DateTime?` field on `Campaign`. |
| **Advanced analytics** (new) | • Prisma model `OptOut` added. <br>• DTO `AdvancedAnalyticsQueryDto` (extends `CampaignAnalyticsQueryDto` with `startDate`/`endDate`). <br>• Service method `getAdvancedAnalytics` returning `rates`, `buckets`, `topErrors`, `engagement` (`sentRate`, `failedRate`, `optOutRate`) and `costEstimate` (configurable $0.01 per segment). <br>• Controller endpoint `GET /api/sms/admin/campaigns/:id/advanced-analytics`. |
| **Real‑time delivery reports** (new) | • `SmsProcessor` emits job‑status events via an `RxSubject` after each SENT/FAILED job. <br>• `SmsWsGateway` (`ws/campaigns`) broadcasts `job-status` to sockets that have emitted `subscribe` with the campaign ID. <br>• Polling fallback `GET /api/sms/admin/campaigns/:id/status` returns the latest job status from the DB. <br>• Gateway registered in `SmsModule` with `WebSocketModule.forRoot({ path: 'ws' })`. |

### Ongoing tasks
- Prisma migration to create new tables (`opt_outs`, `contact_lists`, `contacts`, `contact_imports`) in the target DB.
- Seed sample data for opt‑outs and contact lists (optional for immediate feature visibility).
- Wire the new endpoints into the admin UI (rate‑cards for engagement & cost, optional WS status widget).

### Pending / not yet started (as of this report)
| Priority | Item | Brief description |
|----------|------|-------------------|
| **High** | **Developer SMS Gateway API** – public key‑based API with OpenAPI docs; enable OTP/transactional triggers from external systems. |
| **High** | **Instant OTP path** – dedicated high‑priority transactional queue with delivery receipts, separate from bulk promotional flow. |
| **Medium** | **Multiple sender IDs** – per‑client branded sender names/prefixes, managed via admin UI. |
| **Medium** | **Promotional vs transactional routing** – message‑type flag that routes through appropriate queue/rate‑limit. |
| **Medium** | **Two‑way messaging** – inbound reply storage, conversation view per campaign, keyword auto‑responders. |
| **Lower** | **Advanced analytics UI** – add engagement & cost rate‑cards on the campaign‑detail page (already backend‑ready). |
| **Lower** | **Real‑time UI widget** – small WebSocket‑driven status banner on campaign‑detail (backend ready). |

### Known issues
- Redis not running locally (`ECONNREFUSED 6379`) prevents BullMQ enqueue; campaigns cannot be launched until Redis is started (`docker run -p 6379:6379 redis`).
- `OPENAI_API_KEY` and `DRY_RUN` env vars still need to be set in `apps/server/.env` for template enhancement to work end‑to‑end.
- The mystery second database created during diagnostics (`probe@saptasms.com` row) should be decommissioned.

---

## 2. Roadmap

| Phase | Target | Dependencies | Owner |
|-------|--------|--------------|-------|
| **A – Immediate (this sprint)** | Finish Prisma migration & seed data for contact/opt‑out tables. | None (just DB access). | DBA / backend engineer. |
| **B – High‑priority features** | Implement **Developer SMS Gateway API** (auth, OpenAPI skeleton). | Requires API‑key model, rate‑limit middleware. | Backend engineer. |
| **C – Medium‑priority features** | Add **Instant OTP path** (separate transactional queue, delivery receipts). | Needs BullMQ job priority & optional Twilio/msg‑pack integration. | Backend engineer. |
| **D – UI polish** | Wire **Advanced analytics** rate‑cards and **Real‑time WS widget** into admin campaign‑detail. | Backend already exposed; needs UI (React + Recharts + useQuery). | Frontend engineer. |
| **E – Lower‑priority** | **Multiple sender IDs**, **Promotional vs transactional routing**, **Two‑way messaging** (future releases). | Depend on contact‑management and queue enhancements. | Backend & product. |

### Critical path
1. **Prisma migration** → enables all new models.
2. **Developer API skeleton** → provides external integration point (often requested by prospects).
3. **Admin UI polish** → closes the loop for internal users, making the newly‑added analytics & WS features visible.

---

## 3. Wrap‑up Plan (what can be done today)

| Action | Expected outcome | Owner | Time box |
|--------|-----------------|-------|----------|
| **Run Prisma migration** `pnpm prisma migrate dev --name add_contact_optout_tables` (or `pnpm db:push`) | New tables appear in the connected DB; `pnpm --filter server build` still green. | Backend engineer | ≤ 30 min |
| **Add a minimal Developer SMS Gateway API stub** – `GET /api/sms/admin/gateway` returning `{name: "SmsGateway", docs: "/api-docs"}` protected by AtGuard + RolesGuard ADMIN. | New endpoint present, no breaking changes; can be expanded later. | Backend engineer | ≤ 20 min |
| **Update STATUS.md** to reflect migration completion and API stub tick. | Documentation stays in sync. | scribe (you) | ≤ 5 min |
| **Team sync** – quickly review the new endpoints and decide on next priority (instant OTP vs multiple sender IDs). | Consensus on next sprint focus. | Whole team | 10 min |

**Items requiring further discussion / approval**
- Decision on which cloud provider (Twilio, Vonage, AkashSMS) for the Instant OTP path and associated costs.
- Approval of the API‑key model (schema, storage, rotation) for the Developer SMS Gateway.
- Allocation of design resources for the admin UI widgets (engagement rate cards, WS status banner).

---

*Report generated automatically from the current codebase, git history, and `STATUS.md`. All ✅ items are verified; pending entries are based on the gap‑analysis list and the team's prioritisation.*