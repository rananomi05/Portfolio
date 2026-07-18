# Signal — Portfolio + Contact System + Admin Dashboard

Built for the Dafi Labs x EmpRadar.ai MERN Stack Internship, Week 1 task.
Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion, with
Supabase (Auth + Postgres), Prisma, Resend, and Google reCAPTCHA v3.

## What's inside

- **Portfolio site** (`/`) — Hero, About, Skills, Projects, Experience, Contact,
  Footer. Design direction: a dark "signal room" theme (deep teal-navy, amber
  signal accent, mono data labels) with a hand-drawn oscilloscope waveform as
  the signature element, scroll-reveal sections, and staggered hero motion.
- **Contact Us system** — client + server validation, reCAPTCHA v3, saves to
  Postgres via Prisma, sends a Resend email alert on every submission.
- **Admin auth** — Supabase Authentication, seeded via `scripts/seed-admin.ts`.
  Login page has reCAPTCHA v3 + IP-based rate limiting (5 attempts / 15 min
  block), enforced server-side in `src/app/api/auth/login/route.ts`.
- **Admin dashboard** (`/admin/dashboard`) — total / pending / resolved counts,
  recent contacts.
- **Contact queries page** (`/admin/contacts`) — filter by status, update a
  query to Pending / Done / Resolved.
- **Middleware** protects everything under `/admin` — unauthenticated visitors
  are redirected to `/login`.

## 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Resend](https://resend.com) account + API key
- Google reCAPTCHA v3 keys: https://www.google.com/recaptcha/admin

## 2. Install

```bash
npm install
```

## 3. Environment variables

Copy `.env.example` to `.env` and fill in every value:

```bash
cp .env.example .env
```

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
  project settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` — same page, **service_role** secret. Never
  expose this to the client; it's only used server-side and in the seed script.
- `DATABASE_URL` / `DIRECT_URL` — Supabase project settings → Database →
  Connection string (use the pooled URL for `DATABASE_URL`, direct URL for
  `DIRECT_URL`, which Prisma needs for migrations).
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_ALERT_EMAIL` — Resend
  dashboard. `RESEND_FROM_EMAIL` can stay as `onboarding@resend.dev` until you
  verify your own domain.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` — register a
  reCAPTCHA v3 site for your domain (add `localhost` too for local testing).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — used once by the seed script.

## 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates the `profiles`, `contacts`, and `login_attempts` tables from
`prisma/schema.prisma`.

## 5. Seed the first Admin user

```bash
npm run seed:admin
```

This creates the Admin in Supabase Authentication **and** the matching
`profiles` row, linked by `auth_user_id`. Only one Admin should exist — the
script is safe to re-run (it upserts instead of duplicating).

## 6. Run locally

```bash
npm run dev
```

- Portfolio: http://localhost:3000
- Admin login: http://localhost:3000/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## 7. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: portfolio, contact system, admin dashboard"
git branch -M main
git remote add origin https://github.com/rananomi05/YOUR-REPO-NAME.git
git push -u origin main
```

Then add `empradar` as a collaborator: repo → Settings → Collaborators.

## 8. Deploy on Vercel

1. Import the GitHub repo at https://vercel.com/new.
2. Add every variable from `.env` in Project Settings → Environment Variables.
3. Deploy. Confirm the live URL loads the portfolio, the contact form saves
   and emails correctly, and `/login` → `/admin/dashboard` works end to end.
4. For the final submission, create a `production` branch, push your final
   code there, and redeploy from that branch as required by Task 8.

## 9. Task-9 submission checklist

- [ ] Live Vercel URL
- [ ] GitHub repo URL + `empradar` added as collaborator
- [ ] Loom recording covering: ChatGPT/Cursor prompts, project plan, GPT design
      image, code structure, live site, contact flow, Supabase data, Resend
      email, Admin login, dashboard, status updates, GitHub, Vercel deploy
- [ ] Google Form submitted before the deadline (Sat 18 July 2026, 8:00 PM PKT)

## Troubleshooting — "the login/admin panel isn't working"

This project can't function until it's connected to your own real Supabase
project, database, Resend account, and reCAPTCHA keys — that connection is
Tasks 4-7 of the assignment, not something that ships pre-configured. Check
these in order:

1. **`.env` exists and every value is filled in** (not still the placeholders
   from `.env.example`). Restart `npm run dev` after any change to `.env`.
2. **Migrations were run**: `npx prisma migrate dev --name init` must succeed
   against your `DATABASE_URL` before `contacts`/`profiles`/`login_attempts`
   exist.
3. **Admin was seeded**: `npm run seed:admin` must run successfully. Read its
   console output — it tells you if the user already existed or if creation
   failed (usually a bad `SUPABASE_SERVICE_ROLE_KEY`).
4. **Login says "reCAPTCHA verification failed"**: your
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` are mismatched,
   or the domain (e.g. `localhost`) isn't registered against that reCAPTCHA
   site in the Google admin console. If you haven't set reCAPTCHA up yet at
   all, leave both keys blank — the app skips verification entirely until
   they're configured, so login still works while you build out other pieces.
5. **Login says "email hasn't been verified yet"**: you set
   `ADMIN_REQUIRE_EMAIL_VERIFICATION=true`. Check the Admin's inbox for
   Supabase's confirmation email, or re-run the seed script with that
   variable set to `false` to bypass it.
6. **`/admin` redirects straight back to `/login` after a successful sign-in**:
   almost always a Supabase URL/key mismatch between `.env` and the project
   you actually seeded the Admin into — double check both point to the same
   Supabase project.
7. **Dashboard stats show nothing**: submit a test message through the public
   Contact Us form first — `contacts` starts empty.

## Notes on the "Use ChatGPT/Cursor" requirement

The task requires showing GPT/Cursor prompts and a GPT-generated design image
as evidence — that part is on you to produce and record, since it documents
your own working process for the Loom video. This codebase gives you a
finished, understandable implementation to walk through; make sure you can
explain each part (auth flow, rate limiting, email alert, Prisma models) in
your own words in the recording, per the task's core rule.
