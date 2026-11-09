# 任氏有无轩 · 前端 (rsywx)

The SvelteKit frontend for the RSYWX personal library / blog, consuming the
[`api.rsywx.2026`](../api.rsywx.2026) backend.

## Stack

- **SvelteKit 3** (SSR / dynamic) + **Svelte 5** (runes) + **TypeScript**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **shadcn-svelte** components (`card`, `button`, …)
- Deployed as a Node server (`@sveltejs/adapter-node`)

## Architecture

- **Secrets stay server-side.** `src/env.ts` declares `RSYWX_API_KEY` /
  `RSYWX_API_BASE_URL` via SvelteKit 3's `defineEnvVars`; they are read from
  `$app/env/private` (server-only) and never bundled to the browser.
- **Server-only data layer** lives under `src/lib/server/api/` (SvelteKit blocks
  importing `server/` code into the client). `client.ts` wraps `fetch` and
  throws a typed `ApiError` on non-2xx; `endpoints.ts` is the single source of
  truth for API calls.
- **Pages SSR** data in `+page.server.ts`. Independent widgets load in parallel
  and failures are isolated so one bad endpoint can't blank the page.
- **Visits are recorded separately** from reads: the detail page loads
  read-only and the client records a visit via `POST /api/visit/[bookid]`, so
  hover-preloads and refreshes don't inflate counts (backend INT-03).
- **`/books/visits` (阅览记录)** derives 今日 / 近七日 / 近一月 / 近半年 from a
  single `/books/visit_history?days=180` call — the API has no per-window
  totals. `last_visited` is deduped by `bookid` on the server because that
  endpoint returns **one row per visit**, not per book. The 30-day chart is a
  plain server-rendered SVG (weekends in the spot colour), so the page needs no
  chart library and no client JS.
- **Covers** are served by this app from `/covers/{bookid}.webp` (600px wide,
  WebP q90 re-encoded from the JPEG originals — same dimensions, ~71% fewer bytes).
- **Front-page plates** (`static/images/{hannibal,hilbert,keynes}.webp`) are WebP q90
  too, 818–1400px wide, 85–138 KB each. `byIssue()` picks one per _issue_ — the day
  of the year in `Asia/Shanghai` — on the server, so the plate rotates at midnight
  with no client JS (`hannibal → hilbert → keynes → …`).
- **Share cards** never point at a missing file. Book pages pass their own cover
  (`<Seo image={coverUrl(book.bookid)} />`); every other page falls back to the
  1200×630 `static/images/og-default.png` that `scripts/make-og-card.py` renders
  from the design tokens in `app.css`. Error pages emit no OG tags at all.

## Database schema

The backend ([`api.rsywx.2026`](../api.rsywx.2026)) stores everything in a MySQL
database named `rsywx`. So anyone can build their own app on the same data
model, a **schema-only dump** (no data) is included:

- [`docs/schema.sql`](docs/schema.sql) — all tables, indexes, foreign keys, and
  the `book_visit` → `book_book` visit-counter trigger.

Create the database and import it:

```bash
mysql -u <user> -p -e 'CREATE DATABASE rsywx CHARACTER SET utf8mb4'
mysql -u <user> -p rsywx < docs/schema.sql
```

> `docs/schema.sql` is a **reference snapshot** of the live database. The source
> of truth for the schema is the backend repository's `migrations/` directory.

> **Data note — never derive `bookid` from `id`.** The catalogue mostly follows
> `id 111 → bookid '00111'`, but there are historical exceptions (`id 1779` is
> missing and the next two rows shift by one, so `01781` has neither a row nor a
> cover). Every link, cover path, visit record and tag write keys off the
> `bookid` returned by the API.

## Development

```bash
pnpm install
cp .env.example .env   # set RSYWX_API_BASE_URL + RSYWX_API_KEY
pnpm run dev
```

Point `RSYWX_API_BASE_URL` at the local backend (`…/api/v1`).

### Share-card preview

`/og-preview` audits any page's `og:*` / `twitter:*` tags against the local build:
it fetches the page server-side, then renders the X (large + small), Facebook and
Telegram layouts from the real `og:image`, measuring the crop each one applies.

```
http://localhost:5173/og-preview
http://localhost:5173/og-preview?url=/books/00001.html
```

## Scripts

| Script             | Purpose                            |
| ------------------ | ---------------------------------- |
| `pnpm run dev`     | Dev server                         |
| `pnpm run build`   | Production build (`build/`)        |
| `pnpm run preview` | Preview the build                  |
| `pnpm run start`   | Run the built Node server          |
| `pnpm run check`   | `svelte-kit sync` + `svelte-check` |
| `pnpm run lint`    | Prettier check + ESLint            |
| `pnpm run format`  | Prettier write                     |

## Status

- **T0 (foundation):** done — env, API layer, theming, layout, SEO, tooling.
- **T1 (core):** done — Home, Book detail, Search/List, Readings.
- **T2 (next):** book discovery pages — `/books/visits` (阅览记录: totals, trend,
  hot / cold / recent / forgotten) done; remaining: random / today / popular /
  unpopular / forgotten / last_visited standalone pages, blog pages, weather widget.
