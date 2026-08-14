# AGL — Frontend Case Study

A two-page web app (**Actualités** + **Contact**) built the way a Sitecore JSS app works: **pages are data, not code**. Each route is described by a layout document (placeholders → component renderings → fields), a component registry resolves component names to React implementations, and a single catch-all route renders everything.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 (redirects to `/actualites`). Production build: `npm run build && npm start`.

**Stack:** Next.js 16 (Pages Router) · React 19 · TypeScript · Tailwind CSS 4 · react-hook-form + zod · sanitize-html

> The brief asked for Next.js ≥ 14.2 / React ≥ 18.2. I chose the latest stable versions deliberately: the 14.x line is end-of-life and `npm audit` reports unpatched high-severity advisories against it, which conflicts with the security requirement. The Pages Router is used throughout, as required.

## Architecture

```
src/
  content/              ← mock CMS content (stands in for Sitecore Layout Service)
    site.json           ← site chrome: brand theme, logo, dictionary, nav, footer
    routes/*.json       ← one layout document per route
  services/
    layout-service.ts   ← the ONLY module that knows where content comes from
  context/
    site-context.tsx    ← SiteProvider/useSite (≈ JSS SitecoreContext: locale, dictionary)
  types/
    index.ts            ← content model (mirrors the Layout Service response shape)
  schemas/
    contact-schema.ts   ← zod schemas shared by client and server
    newsletter-schema.ts
  security/
    sanitize.ts         ← HTML allowlist for CMS rich text
    rate-limit.ts       ← in-memory limiter shared by the API routes
  components/
    registry.ts         ← componentName → React component (JSS component factory)
    Placeholder.tsx     ← renders whatever the CMS placed in a named placeholder
    fields/             ← Text / RichText / Image / Link field renderers
    renderings/         ← CMS-managed page components (Sitecore "renderings")
    ui/                 ← form controls (Input, Textarea — each a full labeled row)
    layout/             ← Header / Footer chrome
  pages/
    [[...path]].tsx     ← one route renders every page from layout data
    api/contact.ts      ← form endpoints (mock backends)
    api/newsletter.ts
```

### Component library

The registry key, React component name and file name are always **identical** — the JSS convention, so the CMS-to-code mapping is self-evident.

| Component | Purpose | Rendering params |
|---|---|---|
| `HeroBanner` | Gradient page header: tag pill, title, subtitle, optional CTA | `variant`: `primary` / `compact` |
| `NewsListing` | News card grid with client-side category filter chips | `columns`: 2 / 3 / 4 |
| `NewsletterSignup` | Gradient newsletter band with validated email signup | — |
| `ContactForm` | Full contact form (heading/intro/success are CMS content) | — |
| `Container` | Wrapper exposing a nested `container-content` placeholder | `theme`: default / muted / dark / brand |
| `PageContent` | Free-form sanitized rich text | — |

### Why this shape

- **CMS-driven rendering.** The two pages exist purely as content in `src/content/routes/`. Adding a third page — or an entire subsidiary site — requires zero component code and no new page files. This mirrors AGL's real problem: many sites, one codebase.
- **Multi-site theming.** Brand colors live in `site.json` (`theme`) and are injected as CSS custom properties by the Layout; Tailwind utilities (`bg-brand`, `from-grad-from`, …) resolve against them at runtime. Swapping `site.json` re-brands the entire app — the same components could serve the blue aglgroup.com and this pink subsidiary site.
- **Dictionary + locale as content.** UI phrases ("Tous", "Lire la suite") and the formatting locale come from `site.json` through `useDictionary()`/`useLocale()`, mirroring the Sitecore dictionary service — each market translates without a deployment. Dates are stored as ISO in content and formatted per locale at render time.
- **Component registry + Placeholder** replicate Sitecore JSS's component factory and `<Placeholder />`. An unregistered component name renders a visible warning in development and is skipped silently in production, so an editor mistake can never take a page down.
- **Field renderers** (`Text`, `RichText`, `Image`, `Link`) mean components never touch raw field values — the same discipline JSS enforces, which is what later makes inline editing (Experience Editor / Pages) possible.
- **Rendering parameters** (`params`) drive presentation variants from the CMS: the hero's `variant`, the listing's `columns`, the container's `theme` — one implementation, many editorial uses.
- **Dynamic by content, not code**: the `NewsListing` filter chips are derived from the categories present in the items — an editor adding a third category in the CMS gets a third chip automatically. Badge colors are a `categoryTone` field (editors pick a tone, not a hex code).
- **Nested placeholders**: `Container` exposes its own `container-content` placeholder, demonstrating container composition exactly as Sitecore does it.
- **Migration path**: `services/layout-service.ts` is the only module that knows content comes from the filesystem. Pointing the app at a real Sitecore Layout Service/Edge GraphQL endpoint changes that one file; types, registry, placeholders and components are untouched.

### Trade-offs

- `getStaticPaths` uses `fallback: false` because content ships with the repo. With a live CMS this would be `blocking` + ISR (`revalidate`), so editors publish without redeploys.
- Nav entries for pages that are out of the assessment's scope (À propos, Services, …) point to `#` rather than 404-ing.
- News card images are local SVG placeholders standing in for CMS media-library photos; they flow through the same `Image` field renderer (`next/image`) a real asset would.
- No global state library — nothing here needs one; server data flows through `getStaticProps`, form state lives in react-hook-form.
- Content JSON is trusted-ish (in-repo), but rich text is still sanitized as if it came from a live CMS, because one day it will.

## The contact form

- **One zod schema** (`schemas/contact-schema.ts`) validates on the client (react-hook-form resolver, instant field-level feedback) *and* on the server (`api/contact.ts`) — client validation is UX, never a security boundary.
- Six fields (name, phone, e-mail, company, subject, message); required fields follow the design's asterisks (e-mail, objet, message). Every label, placeholder and message is CMS content — only the validation rules live in code.
- Built from reusable controls (`components/ui/`): `Input` and `Textarea` each render a complete labeled row — label, required asterisk, control, error message and aria wiring derived from one `id`/`error` pair — so any future form is one element per field.
- Full submit lifecycle: disabled/loading state, success panel (message is CMS content), server error surface, "send another message" reset.
- Accessible: proper labels, `aria-invalid`, `aria-describedby` wiring to error messages, `role="alert"`/`role="status"` announcements.
- Backend is a mock: the API validates and accepts, but deliberately does not persist or log PII.
- The newsletter signup follows the same pattern in miniature (`schemas/newsletter-schema.ts` + `api/newsletter.ts`).

## Security layers

| Layer | Where |
|---|---|
| CSP (no external origins), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` | `next.config.ts` |
| CMS HTML sanitized via allowlist before `dangerouslySetInnerHTML` (stored-XSS defense) | `security/sanitize.ts` |
| Server-side re-validation with shared zod schemas | `pages/api/*.ts` |
| Rate limiting (5 req/min/IP per endpoint) + payload caps + method allowlists | `security/rate-limit.ts`, `pages/api/*.ts` |
| Honeypot field (bots get a fake success — no signal to adapt) | `ContactForm.tsx` + API |
| External links get `rel="noopener noreferrer"`; link schemes restricted to https/mailto/tel | `fields/Link.tsx`, `sanitize.ts` |
| Fonts self-hosted via `next/font` (no third-party request), `X-Powered-By` disabled | `_app.tsx`, `next.config.ts` |
| `npm audit`: 0 vulnerabilities | dependency choice |

Known production hardening not done here: CSP nonces instead of `'unsafe-inline'` for scripts, distributed rate limiting (Redis/WAF), CSRF tokens if the form ever moves behind authenticated sessions.

## Adding a component (the CMS workflow)

1. Create it under `components/renderings/`, reading `rendering.fields` through the field renderers.
2. Register it in `components/registry.ts`.
3. Editors can now place it in any placeholder via content JSON — no page code changes.
