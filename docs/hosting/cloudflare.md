# Wijhan — Cloudflare edge configuration

Canonical form: **`https://www.wijhan.com`**, no trailing slash. API: `https://api.wijhan.com`.
The build target is Cloudflare (`nitro` → Workers + static assets), so most of this is dashboard
configuration. The app itself (`src/server.ts` → `src/lib/canonical-redirect.ts`) enforces the same
redirects as a backstop and sets HTML cache headers; `public/_headers` sets static-asset headers.

## 1. DNS / TLS

| Setting                                          | Value                                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `wijhan.com` and `www.wijhan.com`                | proxied (orange cloud), both pointing at the Worker/Pages project                                    |
| SSL/TLS → mode                                   | **Full (strict)**                                                                                    |
| SSL/TLS → Edge Certificates → _Always Use HTTPS_ | On                                                                                                   |
| _Minimum TLS version_                            | 1.2                                                                                                  |
| _HSTS_                                           | On: max-age 12 months (31536000), include subdomains, **preload only once all subdomains are https** |
| _Automatic HTTPS Rewrites_                       | On (prevents mixed content)                                                                          |
| `api.wijhan.com`                                 | proxied or DNS-only, but must serve valid https and CORS for `https://www.wijhan.com` (see §6)       |

Add `wijhan.com` as a custom domain on the project too (so the redirect rule below can answer it).

## 2. Redirect Rules (Rules → Redirect Rules) — one hop, never a chain

Create these **in this order**. Each one sends the visitor straight to the final URL.

**Rule 1 — apex or plain http → `https://www.wijhan.com`, dropping a trailing slash**

- When: `(http.host eq "wijhan.com") or (http.host eq "www.wijhan.com" and not ssl)`
- Then: _Dynamic_ redirect, status **301**, preserve query string off (the expression below re-adds it):

```
concat(
  "https://www.wijhan.com",
  regex_replace(http.request.uri.path, "^(.+)/+$", "${1}"),
  if(len(http.request.uri.query) > 0, concat("?", http.request.uri.query), "")
)
```

> `regex_replace` needs a plan that includes it (Business and above at the time of writing). On Free/Pro,
> use the two-rule fallback below, or rely on the app's own trailing-slash 301 (it is correct but is a
> second hop when combined with an apex/http request).
>
> Fallback for plans without regex: Rule 1 uses `concat("https://www.wijhan.com", http.request.uri.path, …)`
> (keeps the slash), and Rule 2 below removes it.

**Rule 2 — trailing slash on www → no slash** (`/work/` → `/work`)

- When: `(http.host eq "www.wijhan.com") and (len(http.request.uri.path) gt 1) and (ends_with(http.request.uri.path, "/"))`
- Then: _Dynamic_ redirect, 301 → same `concat(…)` with `regex_replace` as above (or use a _Bulk Redirect_ list if regex is unavailable).

**Rule 3 — removed pages** (also handled by the app; list is `LEGACY_REDIRECTS` in `src/lib/canonical-redirect.ts`)

| From          | To            | Status |
| ------------- | ------------- | ------ |
| `/pricing`    | `/contact`    | 301    |
| `/ar/pricing` | `/ar/contact` | 301    |

Verify with:

```bash
curl -sI http://wijhan.com/work/        | grep -iE "^(HTTP|location)"   # one 301 -> https://www.wijhan.com/work
curl -sI https://wijhan.com/about       | grep -iE "^(HTTP|location)"   # one 301 -> https://www.wijhan.com/about
curl -sI http://www.wijhan.com/ar/      | grep -iE "^(HTTP|location)"   # one 301 -> https://www.wijhan.com/ar
curl -sI https://www.wijhan.com/about   | grep -iE "^(HTTP|location)"   # 200, no Location
```

## 3. Caching (Caching → Cache Rules)

The Worker sets `Cache-Control` on HTML (`public, max-age=0, s-maxage=300, stale-while-revalidate=600`;
404 `s-maxage=60`; 5xx `no-store`). Cloudflare does **not** cache HTML by default, so:

| Rule           | Match                                                                                    | Action                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hashed assets  | `starts_with(http.request.uri.path, "/assets/")`                                         | Eligible for cache; Edge TTL: _respect origin_; Browser TTL: _respect origin_ (`public, max-age=31536000, immutable` comes from `public/_headers`) |
| HTML + sitemap | `(http.host eq "www.wijhan.com") and not starts_with(http.request.uri.path, "/assets/")` | Eligible for cache; Edge TTL: _respect origin headers_; Browser TTL: _respect origin_                                                              |
| Bypass         | `http.request.uri.path contains "/admin"`                                                | Bypass cache                                                                                                                                       |

Never set an _override_ TTL on HTML: the origin's `no-store` on 5xx must win, otherwise an API outage
can be cached at the edge.

## 4. Compression (Speed → Optimization → Content Optimization)

- **Brotli: On** (Cloudflare serves br to browsers that accept it, gzip otherwise). Nothing to configure
  in the app.
- Leave _Rocket Loader_ **Off** (it rewrites script loading and breaks hydration timing) and
  _Auto Minify_ **Off** (the build already minifies).
- _Early Hints_: On (lets Cloudflare send the font/CSS `preload`s before the HTML finishes).

## 5. Security headers / SEO-relevant behaviour

- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` are already sent by
  the app (HTML) and `public/_headers` (assets). No Transform Rule needed.
- **CSP** is currently `Content-Security-Policy-Report-Only` (`CSP_ENFORCE=false` in `src/lib/security-headers.ts`).
  Fonts are now self-hosted, so the policy no longer allows Google Fonts. Flip to enforce after a clean pass
  over every page in both languages.
- No public source maps: the build emits none (`seo:audit` checks `*.js.map` is not reachable).
- `robots.txt` and `sitemap.xml` come from the app. The sitemap is dynamic (API-backed) and answers `503`
  with `Retry-After` when the API is down — crawlers retry; do not "fix" this with a stale cached copy.

## 6. API (`https://api.wijhan.com`) — CORS and caching (backend side, recommendations)

- `Access-Control-Allow-Origin: https://www.wijhan.com` (and `https://wijhan.com` is **not** needed: it redirects
  before any API call). The local API currently sends **no** CORS header, so a browser on any other origin gets
  console errors and the page's client-side refetches fail.
- `Cache-Control: public, max-age=60, stale-while-revalidate=300` on `GET /services`, `GET /work`, `GET /work/{slug}`
  (currently `no-cache, private`), so SSR and the sitemap can be served from the edge.
- Return `updated_at` on services and case studies so the sitemap `lastmod` is accurate instead of the deploy date.

## 7. Post-deploy checklist

1. `npm run seo:audit -- --base https://www.wijhan.com` (the audit works against the live site too).
2. Search Console: add the **Domain** property for `wijhan.com`, submit `https://www.wijhan.com/sitemap.xml`,
   inspect `/`, `/ar`, one service and one case study (rendered HTML, canonical, hreflang).
3. Rich Results Test on `/`, `/contact`, one case study (Organization, WebSite, FAQPage, Breadcrumb, CreativeWork).
4. Re-run Lighthouse (mobile) on production — local numbers are a proxy; Core Web Vitals field data needs real traffic.
