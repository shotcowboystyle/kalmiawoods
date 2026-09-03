# Repository Dossier — `kalmiawoods`

**Generated:** 2026-09-03 · **Branch:** `claude/repository-dossier-dgk81d` · **Head:** `b6062bd`

A marketing site plus a private admin app for a mountain vacation rental near Lake
Jocassee and Lake Keowee (Oconee County, SC). Single Astro application, SSR on
Vercel, Neon Postgres for the admin data.

---

## 1. What this actually is

| | |
|---|---|
| **Framework** | Astro 6.4 (`^6.4.8`), SSR via `@astrojs/vercel` |
| **UI layer** | `.astro` components only — **no Vue, no React** |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + DaisyUI 5 |
| **Data** | Neon serverless Postgres (`@neondatabase/serverless`), raw tagged-template SQL |
| **Auth** | Hand-rolled: PBKDF2 password hashing + DB-backed session cookie |
| **Content** | MDX integration + JSON collections under `src/content/` |
| **Animation** | GSAP, Lenis (smooth scroll), Swiper, SplitType |
| **Maps / gallery** | Leaflet, spotlight.js |
| **Validation** | Zod 4 (17 files) |
| **Tests** | Playwright E2E — 3 spec files |
| **Package manager** | pnpm 10.34.5 |
| **Deploy** | Vercel, driven by GitHub Actions (Vercel's own git integration is **disabled**) |

**Scale:** ~19,200 LOC across `src/` (103 `.astro`, 64 `.ts`, 6 `.css`), plus 131 SVGs
and ~75 raster images. 394 files under `src/`.

**History:** the clone is **shallow** (`.git/shallow` present, 50 commits visible), so
age and contributor totals below are partial. Of what is visible: 40 commits are
`renovate[bot]`, 9 are Curtis Blanton, 1 is `shotcowboystyle`. Last 100 subjects skew
heavily to `chore` (32) over `feat` (6). This is a dependency-maintenance-dominated
repo with occasional feature bursts.

---

## 2. Architecture

### Two applications in one Astro project

**Public marketing site** — static-leaning, animation-heavy, content-driven.

```
src/pages/index.astro, rooms, dining, wellness, discover-oconee,
             contact, book-now, check-in, 404, 500, privacy.md, terms.md
src/modules/<Section>/*.astro   ← page-section components, grouped by page
src/app/Layout*.astro           ← layouts + SEO
src/content/{amenities,attractions,restaurants}/*.json
src/lib/modules/*.animation.ts  ← GSAP/scroll behaviours
```

`src/modules/` is the interesting convention: components are grouped by the *page* they
compose (`Landing/`, `Wellness/`, `Discover/`, `Dining/`, `Rooms/`, `Contact/`, `Error/`),
not by type. `Landing/` alone holds 25 files. It reads well for a site whose pages are
each a bespoke long-scroll layout.

**Admin app** — SSR, cookie-authenticated, installable offline-first PWA.

```
src/middleware.ts               ← the only auth gate
src/lib/{db,auth,reservations,password-policy}.ts
src/pages/admin/{index,login,account,logout,offline}
src/pages/admin/reservations/{index,create,edit}
src/pages/admin/users/index
src/components/{AdminLayout,admin/*}.astro
src/sw/sw.template.js           ← service worker source
scripts/build-sw.mjs            ← stamps + emits sw.js post-build
```

### Auth model (`src/lib/auth.ts`, `src/middleware.ts`)

- PBKDF2-SHA256, 100,000 iterations, 32-byte random per-user salt, hex-encoded.
- Opaque 32-byte session token in an `admin_session` cookie: `httpOnly`, `secure`,
  `sameSite: 'lax'`, 7-day max-age. Sessions stored in `admin_sessions`, validated
  against `expires_at > now()` on every request.
- Two roles: `admin`, `super_admin`. `/admin/users*` is `super_admin`-only.
- `mustChangePassword` forces a redirect to `/admin/account?force=1` until cleared.
- Middleware matches `pathname === '/admin' || startsWith('/admin/')` — deliberately
  not `startsWith('/admin')`, so `/admin.webmanifest` and siblings aren't swept in.
  The reasoning is in a comment. Good.

### Offline-first PWA (`/admin`)

The most carefully engineered part of the repo, and it shows in the comments:

- Build id is `VERCEL_GIT_COMMIT_SHA[:12]` in CI, else a SHA-256 over all of `src/**`
  plus `package.json`. It hashes **source**, not emitted asset names, because an
  HTML-only edit leaves `_astro/*` hashes untouched and the update would never reach
  an installed client (`scripts/build-id.mjs`).
- The same id is injected into pages via `vite.define.__BUILD_ID__` and substituted
  into `sw.js`, so a page can tell the worker which build the server is serving.
- The worker precaches admin routes at install time, then **scans the returned HTML**
  for `/_astro/` references rather than maintaining a hand-written asset list — the
  list can't drift from the build.
- `build-sw.mjs` runs *after* `astro build` rather than as an integration, because
  `astro-compress` and the Vercel adapter both hook `astro:build:done` and the adapter
  relocates client output during its hook. The comment says it outright: relative hook
  ordering is "not a thing to stake a deploy on."
- `vercel.json` pins `/sw.js` and `/manifest-admin.webmanifest` to `no-cache` and
  `/_astro/*` to a year of `immutable`.

### Database

Three tables, all defined **only** inside `scripts/seed-admin.ts`:

- `admin_users` — uuid pk, unique email, `password_hash`, `salt`, role CHECK constraint,
  `must_change_password`
- `admin_sessions` — unique token (indexed), FK to user `ON DELETE CASCADE`, `expires_at`
- `reservations` — name, `check_in`/`check_out` as `TIMESTAMPTZ`, property CHECK
  (`main_house` | `workshop` | `both`), composite index on `(property, check_in, check_out)`

`src/lib/reservations.ts` does timezone work properly: check-in/out are stored as
`TIMESTAMPTZ` and combined with a wall-clock hour in `America/New_York` via
`Intl.DateTimeFormat` offset resolution, so DST is handled rather than assumed.

---

## 3. What's solid

- **SQL is safe.** All 30 `sql\`\`` call sites across the admin pages use
  `@neondatabase/serverless` tagged templates with parameter interpolation. No string
  concatenation anywhere. Pagination offsets are bounds-checked
  (`Math.min(Math.floor(rawOffset), 10000)`) before use.
- **Password policy is real** (`src/lib/password-policy.ts`): 12-char minimum, four
  character classes, a common-password denylist that includes property-specific terms
  (`kalmiawoods`, `jocassee`, `keowee`), rejection of passwords containing the email
  local-part, and a 0–4 strength score surfaced to the user.
- **Comments explain *why*, not *what*.** `build-id.mjs`, `build-sw.mjs`,
  `middleware.ts`, `tsconfig.json`, and both CI workflows carry non-obvious rationale
  for non-obvious choices. This is above average.
- **TypeScript is strict** — extends `astro/tsconfigs/strict`, plus `strictNullChecks`,
  `isolatedModules`, `verbatimModuleSyntax`, `@/*` path alias.
- **Node version pinning is reasoned.** CI pins 22.23.2 with a comment explaining that
  Vercel's Lambda runtime tops out at `nodejs22.x` and the Astro adapter emits the
  runtime from the build's Node major.
- **Reduced-motion support is threaded through**, not bolted on: a `prefersReducedMotion()`
  helper in `src/utils/motion.ts` consumed by 8 files including the nav controller,
  shape overlays, and header animation (this was the most recent feature commit, #287).

---

## 4. Problems, ranked

### P0 — Nothing verifies the code before it deploys

There are three workflows: `deploy-preview.yml`, `release.yml`, `deploy-cleanup.yml`.
**None of them run lint, typecheck, or tests.** `release.yml` triggers on push to `main`
and goes straight to `vercel build` → `vercel deploy --prod`.

`pnpm validate` (format:check + lint + types:check) and `pnpm test` exist in
`package.json` and are never executed by any automation. The only gate is whether the
build compiles.

**Fix:** add a `validate` job to `deploy-preview.yml` and make deploy `needs:` it.
Same for `release.yml`. This is a half-hour of work protecting a production site.

### P0 — Git hooks are configured but not installed

`.lintstagedrc.js` and `commitlint.config.cjs` exist. `lint-staged`, `@commitlint/cli`,
and `commitizen` are all in `devDependencies`. But:

- There is **no `.husky/` directory**
- **`husky` is not a dependency**
- There is **no `prepare` script** in `package.json`

So no hook fires on commit. Combined with P0 above, nothing anywhere — local or CI —
runs the linter. `CLAUDE.md` claims "Husky for git hooks with lint-staged." It does not.

### P1 — The contact form does not submit anything

`src/modules/Contact/FormContact.astro` (415 lines) contains three `.form-control`
inputs and a "send message" button. It contains **zero `<form>` elements**, no `action`,
no `fetch()`, and no submit handler. The button's only wired behaviour is a GSAP
paper-plane animation bound with `{ once: true }`.

A visitor filling in this form gets a satisfying animation and their message goes
nowhere. If this is intentional (site pre-launch), it needs a comment saying so. If it
isn't, it is the highest-impact bug in the repo for a business whose purpose is taking
bookings.

### P1 — The database schema has no migration story

The only DDL in the repository lives in `scripts/seed-admin.ts`, mixed in with the
one-time admin-user creation. There is no `migrations/` directory, no schema file, no
migration tool. Schema evolution is currently done by appending
`ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements to the seed script — the `role`
column was added that way, and there is a separate one-off
`scripts/migrate-reservations-to-timestamptz.ts` sitting outside any framework.

There is no way to answer "what is the schema in production?" except by reading a seed
script and a loose migration file and hoping both were run.

**Fix:** extract DDL into ordered `migrations/NNN_*.sql`, add a runner script, and
reduce `seed-admin.ts` to what its name says.

### P1 — No rate limiting or lockout on admin login

`src/pages/admin/login.astro` calls `verifyLogin(email, password)` on every POST with no
attempt counter, no delay, no lockout, no CAPTCHA. PBKDF2 at 100k iterations is a real
cost per attempt, which slows an attacker — but it equally makes the endpoint a cheap
CPU-amplification target for the serverless function.

Note on CSRF: there are no CSRF tokens anywhere in the admin, but `sameSite: 'lax'`
means the session cookie is not sent on cross-site POSTs, and every state-changing route
is a POST (including `/admin/logout`, correctly). So CSRF is mitigated by cookie policy
rather than by tokens. That's acceptable but undocumented — worth a comment so nobody
later "fixes" `sameSite` to `none` and quietly opens the hole.

Also minor: `verifyLogin` compares hashes with `!==`, which is not constant-time. Low
severity for a hash comparison, but a `timingSafeEqual` would cost nothing.

### P2 — Documentation is comprehensively wrong

**`README.md` is the unmodified Turborepo starter README.** It describes a Next.js
monorepo with `docs`, `web`, `ui`, and `eslint-config-custom` packages, and instructs
the reader to `cd my-turborepo`. None of that exists. This is the first file anyone
opens.

**`CLAUDE.md` describes a stack this repo abandoned.** Every one of these claims is false:

| CLAUDE.md says | Reality |
|---|---|
| Astro 3.6.5 | Astro 6.4.8 |
| Vue 3 components, `<script setup>`, `Kw`-prefixed | Zero `.vue` files exist |
| PostgreSQL with **Prisma ORM** | Raw SQL on Neon; no `prisma/` dir, no Prisma dep |
| **Lucia Auth v2** with Prisma adapter | Hand-rolled PBKDF2 + session table |
| **Turbo** for monorepo management | Not a dependency |
| `pnpm db:generate`, `db:migrate:dev`, `db:seed`, `prisma:studio` | None of these scripts exist |
| `pnpm test:e2e:{accessibility,pages,performance,visual}` | None exist |
| `src/components/` prefixed with `Kw` | No component uses that prefix |
| Husky git hooks | Not installed |
| Users/UserProfile/Email tracking tables, USER/ADMIN roles, HOUSE/GARAGE/WORKSHOP enum | Actual: `admin_users`/`admin_sessions`/`reservations`, roles `admin`/`super_admin` |

An agent or new contributor following `CLAUDE.md` would run commands that don't exist
against an ORM that isn't installed. Both files need rewriting from scratch.

### P2 — Dead configuration and dependencies

- **`stylelint.config.cjs`** (2KB) — `stylelint` is not in `package.json` at all and no
  script invokes it. Pure decoration.
- **`.markdownlint.json`** — `markdownlint` is not a dependency.
- **`cspell.json`** + `cspell@^10.1.1` in devDeps — no script runs it.
- **`eslint-plugin-vue` + `vue-eslint-parser`** are configured in `eslint.config.js` with
  a `**/*.vue` override block. There are no `.vue` files.
- **`eslint-plugin-import`**, **`eslint-plugin-jsx-a11y`**, **`eslint-import-resolver-typescript`**
  are in devDeps but never referenced by `eslint.config.js`.
- **`@eslint/markdown`** — imported and then commented out in `eslint.config.js`.
- **`@types/canvas-confetti`** — the repo doesn't use `canvas-confetti`; the orphaned
  `ConfettiLauncher.astro` loads `confetti-js`, a different package.
- **`changeset-bot` is installed on the repository** but there is no `.changeset/`
  directory, no `@changesets/cli` dependency, and no changesets workflow. It comments
  "No Changeset found" on every PR, and its own suggested changeset names the package
  `@fake-scope/fake-pkg` — proof it has no config to read. The package is `private: true`
  at version `0.0.0` and is never published, so changesets is the wrong tool here
  entirely. Uninstall the app; it is pure PR noise.
- **`docker-compose.yml`** mounts `./initdb` — that directory doesn't exist — and reads
  `.env.local` for `POSTGRES_*` vars that `env.example` never documents. Since the app
  connects to Neon via `KW_STORAGE_DATABASE_URL`, this local Postgres appears to be a
  leftover from the Prisma era and is not wired to anything.

### P2 — `ConfettiLauncher.astro` is orphaned and loads a remote script

Nothing imports it. It injects `<script src="https://cdn.jsdelivr.net/npm/confetti-js@0.0.18/dist/index.min.js">`
with `is:inline`, no `integrity` attribute, and no SRI. Even unused, it's a third-party
script tag sitting in the component tree waiting to be reintroduced. Delete it, or
vendor the dependency and add SRI.

### P2 — Environment variables are undeclared and drifting

`src/env.d.ts` declares `APP_NAME`, `SITE`, `PUBLIC_VERCEL_ANALYTICS_ID`, and
`KW_STORAGE_DATABASE_URL`. But:

- `astro.config.mjs` reads `APP_SITE` and `APP_HOST` — **neither is declared** in
  `env.d.ts`, so TypeScript provides no safety and a missing value silently disables
  `site` (breaking sitemap URLs) and image domain allowlisting.
- `PUBLIC_VERCEL_ANALYTICS_ID` is declared but used nowhere.
- `env.example` documents exactly one variable: `KW_STORAGE_DATABASE_URL`. Nobody can
  set this project up from it.

### P3 — Node version split between local and CI

`mise.toml` pins Node **24.19.0** for local development. CI and production build on
Node **22.23.2** (correctly, per the Vercel Lambda ceiling). Local dev therefore runs a
major version that production cannot run. Align `mise.toml` to 22.x, or document
explicitly why the split is intentional.

### P3 — Playwright config points at tests that don't exist

`playwright.config.ts` defines five projects with `testIgnore`/`testMatch` rules
referencing `.*/performance/index.spec.ts`, and a `desktop-chrome` project that exists
solely to run it. There is no `performance/` directory. The actual `e2e/tests/` holds
three specs: `contact.spec.ts`, `home.spec.ts`, `navigation.spec.ts`. The
`desktop-chrome` project matches nothing and runs zero tests.

Coverage is also thin in a specific way: **the admin app — the only part with auth,
a database, and mutations — has no tests at all.** The three specs cover public marketing
pages. `@axe-core/playwright` is installed; no test imports it.

### P3 — Spelling errors baked into filenames

`src/modules/Dining/` contains `RestarauntList.astro`, `RestarauntSummaryOne.astro`,
`RestarauntSummaryTwo.astro`. "Restaraunt" → "Restaurant", in three filenames and every
import of them. `cspell` is installed and would have caught this if anything ran it.

---

## 5. Notable engineering decisions worth preserving

Recorded so a future refactor doesn't undo them by accident:

1. **`vercel.json` sets `git.deploymentEnabled: false`.** Deploys go exclusively through
   GitHub Actions using `vercel build` + `vercel deploy --prebuilt`. Re-enabling the git
   integration would produce duplicate deployments.
2. **`tsconfig.json` deliberately omits `baseUrl`** — a comment notes TypeScript 7
   removed it and its presence crashed `astro check` in `getTsconfig`. `paths` resolve
   relative to the file instead.
3. **Manual Rollup chunks** for `leaflet` and `spotlight.js` keep two heavy libraries out
   of the main bundle.
4. **`astro-compress` is configured with `HTML: { removeAttributeQuotes: false }`**, and
   the service worker's HTML asset scanner has a comment noting the compressor ignores
   this option for prerendered pages — the scanner handles both quoted and unquoted
   attributes as a result.
5. **`trailingSlash: 'never'`** in Astro config matched by `"trailingSlash": false` and
   `"cleanUrls": true` in `vercel.json`. Change one, change all three.

---

## 6. Recommended order of work

| # | Action | Effort |
|---|---|---|
| 1 | Add a `validate` + `test` CI job; gate both deploy workflows on it | ~1h |
| 2 | Install `husky`, add `prepare` script, wire the existing lint-staged/commitlint configs | ~30m |
| 3 | Determine whether the contact form is meant to submit; wire it or document the stub | ~2h |
| 4 | Rewrite `README.md` and `CLAUDE.md` to describe the actual stack | ~2h |
| 5 | Extract DDL into versioned migrations; slim `seed-admin.ts` | ~3h |
| 6 | Add login rate limiting / lockout; comment the SameSite-as-CSRF-defence decision | ~2h |
| 7 | Declare `APP_SITE`/`APP_HOST` in `env.d.ts`; complete `env.example` | ~30m |
| 8 | Delete dead config and deps (stylelint, markdownlint, vue eslint, ConfettiLauncher, docker-compose) — or install and use them | ~1h |
| 9 | Add Playwright coverage for the admin auth + reservation CRUD paths | ~1d |
| 10 | Fix the `Restaraunt` filenames; align `mise.toml` to Node 22 | ~30m |

Items 1 and 2 are the ones that change the repo's risk profile. Everything else is
cleanup that becomes safer once they're in place.

---

## 7. Quick reference

```bash
pnpm dev            # astro dev            → localhost:4321
pnpm build          # astro build && node scripts/build-sw.mjs
pnpm preview        # astro preview
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm format         # prettier --write
pnpm types:check    # astro sync && tsc --noEmit && astro check
pnpm validate       # format:check + lint + types:check  (parallel)
pnpm test           # playwright test e2e/tests/
pnpm test:playwright:ui

# One-time DB bootstrap (also the only place the schema is defined)
ADMIN_EMAIL=… ADMIN_PASSWORD=… KW_STORAGE_DATABASE_URL=… npx tsx scripts/seed-admin.ts
```

**Required env:** `KW_STORAGE_DATABASE_URL` (Neon connection string, server-only).
**Also read but undeclared:** `APP_SITE`, `APP_HOST`.
