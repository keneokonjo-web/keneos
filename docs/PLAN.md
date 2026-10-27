# Kene OS — Plan v1 (draft for approval)

Owner: Kene Okonjo (sole user). A personal "life OS". WAYKON businesses are one section of it, not the whole.
Status: planning only. No code, no integrations connected, no design started.

## 0. Corrections locked in
- The OS is Kene's, not WAYKON's. Name working title: **Kene OS** (rename if wanted).
- **FutureMakers Academy is excluded entirely.** Not in data, nav, search or reports.
- WAYKON Holdings is a brand/intent, **not registered**. No venture is registered.
- Intended structure (shown as "intended", not legal fact): Kene 100% → WAYKON Holdings 100% → Plot42, Fieldwork, WAYKON Media.
- Single user. No team access, no roles for now.
- Plot42: live; next event in summer. Fieldwork: just started, no paying clients. WAYKON Media: not operating yet (planned Instagram + YouTube, edited in CapCut).
- Records live in Google Drive; communication via WhatsApp and Gmail.

## 1. Modules (pages)

### Home (Jarvis-style command centre) — design after your reference image
- Today: top priorities + today's tasks (all areas, filterable)
- Checklists per area (business / personal)
- Calendar: today + next 7 days (Google Calendar)
- Money snapshot: balances, wallets, FX rates, total savings
- Savings plan progress
- Important mail (ranked from Gmail, read-only)
- Quick-add (task, note, expense, idea, decision)
- Jarvis panel (text first, voice later)

### Businesses
- Overview: the three ventures + WAYKON Holdings, status, next milestone, open checklist items
- Each venture opens a **custom-themed workspace** (own look, own modules):
  - **WAYKON Holdings**: brand/identity, intended ownership chart, decisions log, registration checklist, cross-venture tasks. Consolidated finance only once real data exists.
  - **Plot42 / 42**: event pipeline (summer event), event checklist & timeline, budget vs actual, ticket tiers & sales (empty until you enter real figures), vendors/artists/venues, sponsors, deadlines/deposits, post-event report, clothing releases (only if active).
  - **Fieldwork**: prospect/outreach list, pipeline, follow-up reminders, proposals, offer definition, build checklist, deployed-systems record, revenue (starts at zero, honest).
  - **WAYKON Media**: content pipeline (idea → script → film → edit → publish), editorial calendar, Instagram/YouTube tracking, series/formats, source & fact-check status (fact / claim to verify / analysis / opinion), CapCut project notes, performance once publishing begins.

### Personal finance
- Accounts and wallets (manual first; bank/crypto read-only links later)
- Exchange rates (live public FX feed: NGN/USD/GBP/EUR etc.)
- Savings plan, goals, total savings, net-worth overview
- Expenses and budgets; separate **personal vs business** money (no double-counting)

### Investments
- Savings, stock portfolio, other holdings; allocation, gain/loss, history
- Holdings entered manually; prices pulled from a market-data API where covered

### Mail & Files
- Gmail: important mail view, search, draft/reply with approval
- Drive: browse, search, preview Docs/Sheets/PDF/images inside the OS; open in Google for editing

### Tasks & Goals
- One task system (priority, due date, area, checklist); personal goals (30/90/365-day)

### Lifestyle
- Personal to-do, places to visit, social content ideas, Instagram dump planner
- Watchlist: movies + series with posters, 1–5 star ratings, favourites, status (watched/want)
- Mood/inspiration board (Pinterest-style, own saved images)
- Personal care routines, gym (workouts/progress), meal prep (plans, grocery list)

### Assistant (Jarvis)
- Claude-powered chat with access to your OS data; can propose actions
- Voice input/output
- All sends, edits, deletes need your tap-to-approve

### Settings
- Login/security, integrations (connect/disconnect), notifications, categories, themes per venture, export/backup

## 2. What is and isn't feasible (researched, honest)

| Wish | Verdict | Plan |
|---|---|---|
| Gmail important mail | Yes | Gmail API, read-only first; send only with approval |
| Google Calendar | Yes | Read first, create events with approval |
| Drive files + view docs/sheets | Yes | Drive API + embedded Google preview; editing opens Google |
| Claude inside the OS | Yes | Anthropic API (key kept server-side) |
| "Jarvis" voice commands ("email X") | Yes in stages | Text first → voice via browser speech → action tools with approval step |
| Embedded browser | **Partly.** Most sites (Instagram, Google, banks) forbid being framed. | Link previews/reader view + "open in new tab". A true in-OS browser needs a desktop app (Electron) — later option |
| WhatsApp inside OS | **No** for a personal account (no official API) | Quick "open chat" links and manual notes. WhatsApp Business API is a separate paid setup |
| Live bank balances | Possible via Nigeria aggregators (e.g. Mono) with read-only link; coverage varies, costs/approval apply | Phase 2; manual balances in phase 1 |
| Crypto wallets | Yes, read-only by public address | Phase 2 |
| Exchange rates | Yes | Free/low-cost FX API |
| Stocks | US/global easy; Nigerian (NGX) data patchy | Manual holdings + price API where available |
| Instagram dump planner | Planner yes; auto-posting to a personal account **no** | Visual grid planner with uploaded images, captions, dates; you post manually |
| Pinterest | API restricted | Own mood board; Pinterest board embeds/links |
| Movie/series covers | Yes | TMDB API (free, attribution required) |

## 3. Architecture (simple, one maintainer)
- Web app, installable as a PWA on phone + desktop (Next.js + TypeScript)
- Hosting: Vercel. Database + file storage: Postgres (Supabase or Neon). Verify what you already have on Vercel/GitHub before choosing.
- Auth: single-owner login via Google sign-in + passkey/2FA; no public pages
- Integrations isolated behind adapters; secrets only in environment variables
- Layers kept separate: UI / data (DB) / integrations / AI. Per-venture themes are config, so adding a venture needs no rebuild
- Audit log for money edits, deletes and AI/automation actions; soft-delete + undo; daily DB backup + export
- Estimated running cost: roughly $0–$25/month at start (hosting/DB tiers) plus Claude API usage (pay per use; set a monthly cap)

## 4. Data principles
- No fake data in production. Empty states instead; labelled demo mode optional
- Every money figure tagged: actual / estimate / target / forecast
- Personal vs business money kept apart; transfers excluded from totals
- Historical prices/ideas (e.g. old ticket tiers) not shown as live unless you confirm

## 5. Phasing
1. **Foundation**: login, shell/navigation, Home, tasks/checklists, goals, quick-add, settings
2. **Businesses**: Businesses overview + four workspaces (manual data entry)
3. **Google**: Calendar, Gmail (read), Drive browse/preview
4. **Money**: personal finance, savings plan, FX rates, investments (manual + price feeds)
5. **Lifestyle**: watchlist, ideas, Instagram planner, gym, meals, care
6. **Jarvis**: Claude chat → grounded Q&A → approved actions (draft email, create task/event) → voice
7. **Live links**: bank/crypto read-only, optional desktop wrapper

Each phase ends with a working, tested release.

## 6. Open decisions for you
1. Name of the OS (Kene OS?) and WAYKON spelling confirmed as "WAYKON"?
2. Embedded browser: accept previews + new-tab for now, desktop app later?
3. Banks you use (for aggregator coverage) and wallet types (crypto, Wise/Payoneer, Paystack/Flutterwave, etc.)
4. Which stocks/markets (US, NGX, other)?
5. Anything you'd keep private from AI (e.g. finances) — default proposal: AI sees finance only when you ask
6. Phone vs desktop: which do you use more? (affects layout priority)
7. Your Home reference image and other design references (design starts after scope is approved)
8. Confirm Phase 1 start order or reorder phases
