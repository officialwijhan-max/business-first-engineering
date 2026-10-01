# Running the SEO audit

`npm run seo:audit` crawls every URL in `/sitemap.xml` of a **running production build** and checks the HTML
that search engines actually receive (SSR output, not the hydrated DOM). It prints a table, then every failed
rule, and exits `1` if anything fails. No dependencies.

## 1. Start a production build locally

`vite preview` does not work with the Nitro output (it looks for `dist/server/server.js`), and the default Nitro
target is Cloudflare (a Worker, not runnable with plain Node). For local checks build the same code with the
Node preset:

```bash
# the API must be reachable; use the real dev API or any compatible one
NITRO_PRESET=node-server VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1 npm run build
PORT=4300 HOST=127.0.0.1 node .output/server/index.mjs
```

(`VITE_API_BASE_URL` is read at build time; a production build refuses non-https URLs except loopback.)
The API must send `Access-Control-Allow-Origin` for the origin you browse from, or the browser console will show
CORS errors that are unrelated to the site (Lighthouse "errors-in-console").

## 2. Run it

```bash
npm run seo:audit                                        # http://127.0.0.1:4300
npm run seo:audit -- --base http://127.0.0.1:4300 --json audit.json
SEO_AUDIT_BASE=https://www.wijhan.com npm run seo:audit  # against the live site
```

The sitemap lists canonical `https://www.wijhan.com/...` URLs; each is fetched from `--base` under the same
path, so the audit also proves the canonical URLs written *inside* the HTML are the real ones.

## 3. What it checks

| Area | Rules (a violation fails the run) |
| --- | --- |
| Status | 200 for every sitemap URL; bogus paths (`/__x`, `/ar/__x`, `/work/__x`, `/services/__x`, both languages) return a real **404** with `noindex` and no canonical |
| Redirects | `/work/` → `/work` and `/ar/` → `/ar` in one 301; `http://` and apex `wijhan.com` → `https://www.wijhan.com` in **one** hop; `/pricing` → `/contact`; the canonical URL itself never redirects |
| robots.txt | `Sitemap:` line, `/admin` and `/api` disallowed, no `Disallow: /`, JS/CSS/asset paths not blocked |
| sitemap.xml | absolute `https://www.wijhan.com` URLs, no duplicates or trailing slashes, valid `lastmod`, reciprocal `xhtml:link` hreflang, every entry self-referencing |
| `<head>` | `lang`/`dir` (`ar`/`rtl` on `/ar/*`), charset, viewport; one `<title>` 30–60 chars and one description 70–160 chars, **unique across pages**, Arabic text on Arabic pages and vice versa |
| Canonical / hreflang | exactly one absolute self-referencing canonical; exactly `en`, `ar`, `x-default`, absolute, equal to the sitemap's set; no `noindex` on public pages |
| Social | `og:title/description/type/url/image/locale/locale:alternate/site_name` consistent with title, description and canonical; Twitter `summary_large_image` + title/description/image; the OG image is a 1200×630 PNG |
| Icons | favicon, apple-touch-icon, manifest (valid, icons reachable), `theme-color` |
| Headings | exactly one non-empty `<h1>`; no skipped levels |
| JSON-LD | parses; `@context` schema.org; every `url`/`item`/`@id`/`logo` on `https://www.wijhan.com`; no localhost/placeholder text; Organization + WebSite on home, BreadcrumbList on inner pages (last crumb = the page), Service on service pages, CreativeWork on case studies, FAQPage on contact with every question actually visible |
| Images | every `<img>` has an `alt` attribute (`alt=""` is allowed for decorative images). Missing `width`/`height`/aspect-ratio and a lazy first image are reported as **warnings** |
| Links | every internal link returns 200; no external link without `rel="noopener noreferrer"`; no absolute link to another origin of our own site; no trailing-slash links; no generic anchor text ("click here"); no `javascript:`; links keep the page's language (only the language switcher may cross); no orphan page (every sitemap URL is linked from another crawled page) |
| Security | HSTS present; no mixed content; bundles don't reference source maps and `*.js.map` is not reachable |

Warnings never fail the run but are listed so they can be tracked.

## 4. Unit tests

`npm test` (Vitest) covers the pure rules behind the audit: `pageHead`/JSON-LD builders, the sitemap builder,
redirect rules, cache headers, `robots.txt`, static SEO assets, and the 404-vs-500 loader policy
(`src/lib/*.test.ts`).

## 5. Simulating an API outage

SSR must stay up when the backend is down. Static pages (home, about, process, contact) keep returning 200;
pages that need an API record (`/services*`, `/work*`, `/case-studies`) return the localized error page with a
real **HTTP 500** and `Cache-Control: no-store`; `sitemap.xml` returns **503** with `Retry-After`. To test, put any
failing proxy in front of the API (the SSR API timeout is 5 s, no server-side retry) and request those URLs.
