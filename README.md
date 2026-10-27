# Kene OS

A private, single-owner life and business operating system. Next.js (App Router) on Vercel.

## What exists today
Login (single owner) · Home with the Jarvis orb and widgets · Plan (tasks, week, calendar) · Goals and life plan · Activity (notifications + timeline) · Businesses (WAYKON Holdings, Plot42, Fieldwork, WAYKON Media, each with its own themed workspace) · Personal finance · Investments · Education (A-levels) · Health and routine · Personal development · Lifestyle · Files · Waiting room · Reviews · Assistant · Settings · Setup questionnaire · Command palette (Ctrl/Cmd+K) and quick add (Ctrl/Cmd+J).

## Data
All records are stored in the browser (localStorage) on the device you use. There is no server database yet, so data does not sync between devices. Use Settings → Data to download and restore a backup. A database is the next infrastructure step.

## Environment variables (Vercel → Project → Settings → Environment Variables)
| Name | Purpose |
|---|---|
| `OWNER_EMAIL`, `OWNER_NAME`, `OWNER_PASSWORD_HASH`, `AUTH_SECRET` | The owner login. On a fresh deploy open `/login` → "Create account"; it prints these four values. Paste them into Vercel and redeploy. Account creation closes once `OWNER_PASSWORD_HASH` exists. |
| `ANTHROPIC_API_KEY` | Enables assistant replies. Server-side only. |
| `ANTHROPIC_MODEL` | Optional model override. |

Never commit secrets. `.env*.local` is git-ignored.

## Images
Drop photos in `public/images/` (see the README there). Missing files fall back to generated artwork.

## Develop
```
npm install
npm run dev
npm run typecheck
npm run build
```
