#!/usr/bin/env node
/**
 * Technical SEO audit. Crawls every URL in the sitemap of a RUNNING production build and
 * checks what search engines actually receive (the SSR HTML, not the hydrated DOM).
 *
 *   npm run build && <start the production server>      # see docs/seo-audit.md
 *   npm run seo:audit                                   # defaults to http://127.0.0.1:4300
 *   SEO_AUDIT_BASE=http://127.0.0.1:4300 npm run seo:audit
 *   npm run seo:audit -- --base http://127.0.0.1:4300 --json report.json
 *
 * The sitemap lists canonical https://www.wijhan.com URLs; each is fetched from BASE under the
 * same path, so the audit also verifies that the canonical URLs inside the HTML are the real
 * ones (not localhost). Prints a table and exits 1 on any failure. No dependencies.
 */
import http from "node:http";
import fs from "node:fs";

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = (argValue("--base") || process.env.SEO_AUDIT_BASE || "http://127.0.0.1:4300").replace(
  /\/+$/,
  "",
);
const JSON_OUT = argValue("--json");
const SITE = "https://www.wijhan.com";

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;
const GENERIC_LINK_TEXT = new Set(["click here", "here", "read more", "more", "link", "click"]);

const failures = []; // { page, rule, detail }
const warnings = [];
const fail = (page, rule, detail) => failures.push({ page, rule, detail });
const warn = (page, rule, detail) => warnings.push({ page, rule, detail });

// ---------- helpers ----------
const len = (s) => [...s].length;

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseAttrs(tag) {
  const out = {};
  const re = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  const inner = tag.replace(/^<\w+/, "").replace(/\/?>$/, "");
  let m;
  while ((m = re.exec(inner))) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

const tagsOf = (html, name) =>
  (html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || []).map(parseAttrs);
const textOf = (fragment) =>
  decode(fragment.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

async function get(path, init = {}) {
  const url = path.startsWith("http") ? path : BASE + path;
  return fetch(url, { redirect: "manual", ...init });
}

/** Raw http request, so the Host / X-Forwarded-* headers can be set (fetch forbids Host). */
function rawRequest(path, headers) {
  const u = new URL(BASE + path);
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: u.hostname, port: u.port, path: u.pathname + u.search, method: "GET", headers },
      (res) => {
        res.resume();
        resolve({ status: res.statusCode, location: res.headers.location });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function pngSize(buffer) {
  if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function walkJsonLd(node, visit) {
  if (Array.isArray(node)) return node.forEach((n) => walkJsonLd(n, visit));
  if (node && typeof node === "object") {
    visit(node);
    Object.values(node).forEach((v) => walkJsonLd(v, visit));
  }
}

const normalizeUrl = (url) => url.replace(/\/+$/, "");
const isArabicPath = (p) => p === "/ar" || p.startsWith("/ar/");
const counterpart = (path) =>
  isArabicPath(path) ? (path === "/ar" ? "/" : path.slice(3)) : path === "/" ? "/ar" : "/ar" + path;

// ---------- site-level checks ----------
async function auditRobots() {
  const res = await get("/robots.txt");
  const body = await res.text();
  if (res.status !== 200) return fail("/robots.txt", "robots.status", String(res.status));
  if (!/^Sitemap:\s*https:\/\/www\.wijhan\.com\/sitemap\.xml\s*$/im.test(body))
    fail("/robots.txt", "robots.sitemap", "missing 'Sitemap: https://www.wijhan.com/sitemap.xml'");
  if (!/^Disallow:\s*\/admin/im.test(body))
    fail("/robots.txt", "robots.admin", "/admin not disallowed");
  if (!/^Disallow:\s*\/api/im.test(body)) fail("/robots.txt", "robots.api", "/api not disallowed");
  if (/^Disallow:\s*\/\s*$/im.test(body))
    fail("/robots.txt", "robots.block-all", "Disallow: / blocks the whole site");
  if (/^Disallow:.*(\.js|\.css|\/assets|\/og|\/data)/im.test(body))
    fail("/robots.txt", "robots.assets", "JS/CSS/assets must not be disallowed");
  if (/localhost|127\.0\.0\.1/.test(body))
    fail("/robots.txt", "robots.localhost", "localhost in robots.txt");
}

async function loadSitemap() {
  const res = await get("/sitemap.xml");
  if (res.status !== 200) {
    fail("/sitemap.xml", "sitemap.status", String(res.status));
    return [];
  }
  const xml = await res.text();
  if (!(res.headers.get("content-type") || "").includes("xml"))
    fail("/sitemap.xml", "sitemap.content-type", res.headers.get("content-type") || "none");
  const entries = [];
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = decode((block.match(/<loc>([^<]*)<\/loc>/) || [])[1] || "").trim();
    const lastmod = (block.match(/<lastmod>([^<]*)<\/lastmod>/) || [])[1];
    const alternates = [...block.matchAll(/<xhtml:link\b[^>]*>/g)].map((m) => parseAttrs(m[0]));
    entries.push({ loc, lastmod, alternates });
  }
  const seen = new Set();
  for (const e of entries) {
    if (!e.loc.startsWith(SITE + "/") && e.loc !== SITE)
      fail("/sitemap.xml", "sitemap.origin", e.loc);
    if (/\/$/.test(e.loc) && e.loc !== SITE + "/")
      fail("/sitemap.xml", "sitemap.trailing-slash", e.loc);
    if (seen.has(e.loc)) fail("/sitemap.xml", "sitemap.duplicate", e.loc);
    seen.add(e.loc);
    if (
      !e.lastmod ||
      !/^\d{4}-\d{2}-\d{2}$/.test(e.lastmod) ||
      new Date(e.lastmod) > new Date(Date.now() + 864e5)
    )
      fail("/sitemap.xml", "sitemap.lastmod", `${e.loc}: ${e.lastmod}`);
    for (const alt of e.alternates) {
      if (!alt.href?.startsWith(SITE))
        fail("/sitemap.xml", "sitemap.alt-origin", `${e.loc}: ${alt.href}`);
    }
  }
  // reciprocity inside the sitemap: every alternate must itself be an entry with the same set
  const byLoc = new Map(entries.map((e) => [e.loc, e]));
  for (const e of entries) {
    for (const alt of e.alternates) {
      const target = byLoc.get(alt.href);
      if (!target)
        fail("/sitemap.xml", "sitemap.alt-missing", `${e.loc} -> ${alt.href} not listed`);
      else if (JSON.stringify(target.alternates) !== JSON.stringify(e.alternates))
        fail("/sitemap.xml", "sitemap.alt-reciprocal", `${e.loc} <-> ${alt.href}`);
    }
    const self = e.alternates.find(
      (a) => a.hreflang === (isArabicPath(new URL(e.loc).pathname) ? "ar" : "en"),
    );
    if (e.alternates.length && self?.href !== e.loc)
      fail("/sitemap.xml", "sitemap.alt-self", e.loc);
  }
  return entries;
}

async function auditStatusAndRedirects() {
  for (const path of [
    "/__seo-audit-404__",
    "/ar/__seo-audit-404__",
    "/work/__seo-audit-404__",
    "/ar/work/__seo-audit-404__",
    "/services/__seo-audit-404__",
    "/ar/services/__seo-audit-404__",
  ]) {
    const res = await get(path);
    if (res.status !== 404) fail(path, "status.404", `expected 404, got ${res.status}`);
    else {
      const html = await res.text();
      if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(html))
        fail(path, "status.404-noindex", "404 page lacks noindex");
      if (/<link[^>]+rel="canonical"/i.test(html))
        fail(path, "status.404-canonical", "404 page must not declare a canonical");
    }
  }
  // trailing slash: one hop, straight to the clean URL
  for (const [from, to] of [
    ["/work/", "/work"],
    ["/ar/", "/ar"],
    ["/services/erp-solutions/", "/services/erp-solutions"],
  ]) {
    const res = await get(from);
    const loc = res.headers.get("location") || "";
    if (res.status !== 301 || new URL(loc, BASE).pathname !== to)
      fail(from, "redirect.trailing-slash", `expected 301 -> ${to}, got ${res.status} ${loc}`);
  }
  // host / scheme canonicalization, sent as if the request came through the proxy
  const cases = [
    [{ host: "wijhan.com", "x-forwarded-proto": "https" }, "/about", SITE + "/about"],
    [{ host: "www.wijhan.com", "x-forwarded-proto": "http" }, "/about", SITE + "/about"],
    [{ host: "wijhan.com", "x-forwarded-proto": "http" }, "/work/", SITE + "/work"],
  ];
  for (const [headers, path, expected] of cases) {
    const res = await rawRequest(path, headers);
    if (res.status !== 301 || res.location !== expected)
      fail(
        `${headers.host} ${headers["x-forwarded-proto"]} ${path}`,
        "redirect.canonical-host",
        `expected single 301 -> ${expected}, got ${res.status} ${res.location}`,
      );
  }
  const ok = await rawRequest("/about", { host: "www.wijhan.com", "x-forwarded-proto": "https" });
  if (ok.status !== 200)
    fail(
      "www https /about",
      "redirect.canonical-ok",
      `canonical URL must not redirect (got ${ok.status})`,
    );
}

// ---------- per-page audit ----------
const pages = new Map(); // path -> record

async function auditPage(entry) {
  const path = new URL(entry.loc).pathname || "/";
  const expected = entry.loc;
  const res = await get(path);
  const html = await res.text();
  const rec = {
    path,
    status: res.status,
    issues: 0,
    links: [],
    title: "",
    description: "",
    imgs: 0,
  };
  pages.set(path, rec);
  const F = (rule, detail) => {
    rec.issues++;
    fail(path, rule, detail);
  };

  if (res.status !== 200) return F("status", `expected 200, got ${res.status}`);
  const head = html.slice(0, html.indexOf("</head>"));
  const body = html.slice(html.indexOf("<body"));
  const arabic = isArabicPath(path);

  // lang / dir / charset / viewport
  const htmlTag = parseAttrs((html.match(/<html\b[^>]*>/i) || [""])[0]);
  if (htmlTag.lang !== (arabic ? "ar" : "en")) F("html.lang", `lang="${htmlTag.lang}"`);
  if (arabic && htmlTag.dir !== "rtl") F("html.dir", `dir="${htmlTag.dir}" on an Arabic page`);
  if (!arabic && htmlTag.dir && htmlTag.dir !== "ltr")
    F("html.dir", `dir="${htmlTag.dir}" on an English page`);
  if (!/<meta[^>]+charset/i.test(head)) F("meta.charset", "missing");
  if (!/<meta[^>]+name="viewport"/i.test(head)) F("meta.viewport", "missing");

  // title / description
  const titles = head.match(/<title>[^<]*<\/title>/g) || [];
  const title = decode((titles[0] || "").replace(/<\/?title>/g, ""));
  rec.title = title;
  if (titles.length !== 1) F("title.count", `${titles.length} <title> tags`);
  if (len(title) < TITLE_MIN || len(title) > TITLE_MAX)
    F("title.length", `${len(title)} chars: "${title}"`);
  const metas = tagsOf(head, "meta");
  const meta = (key, val) => metas.filter((m) => m[key] === val);
  const descTags = meta("name", "description");
  const description = descTags[0]?.content || "";
  rec.description = description;
  if (descTags.length !== 1) F("description.count", `${descTags.length} description tags`);
  if (len(description) < DESC_MIN || len(description) > DESC_MAX)
    F("description.length", `${len(description)} chars: "${description}"`);
  const hasArabicLetters =
    /\p{Script=Arabic}/u.test(title) && /\p{Script=Arabic}/u.test(description);
  if (arabic && !hasArabicLetters)
    F("i18n.arabic-meta", "Arabic page without Arabic title/description");
  if (!arabic && /\p{Script=Arabic}/u.test(title + description))
    F("i18n.english-meta", "English page with Arabic title/description");

  // robots meta
  for (const r of meta("name", "robots"))
    if (/noindex/i.test(r.content || "")) F("robots.noindex", "public page is noindex");

  // canonical
  const canonicals = tagsOf(head, "link").filter((l) => l.rel === "canonical");
  if (canonicals.length !== 1) F("canonical.count", `${canonicals.length} canonical links`);
  else if (canonicals[0].href !== expected)
    F("canonical.value", `${canonicals[0].href} != ${expected}`);

  // hreflang
  const alternates = tagsOf(head, "link").filter((l) => l.rel === "alternate" && l.hreflang);
  const alt = Object.fromEntries(alternates.map((a) => [a.hreflang, a.href]));
  const enPath = isArabicPath(path) ? counterpart(path) : path;
  const arPath = isArabicPath(path) ? path : counterpart(path);
  const enUrl = SITE + (enPath === "/" ? "" : enPath);
  const arUrl = SITE + arPath;
  if (alt.en !== enUrl) F("hreflang.en", `${alt.en} != ${enUrl}`);
  if (alt.ar !== arUrl) F("hreflang.ar", `${alt.ar} != ${arUrl}`);
  if (alt["x-default"] !== enUrl) F("hreflang.x-default", `${alt["x-default"]} != ${enUrl}`);
  if (alternates.length !== 3)
    F(
      "hreflang.count",
      `expected exactly en/ar/x-default, got ${alternates.map((a) => a.hreflang).join(",")}`,
    );
  const sm = entry.alternates
    .map((a) => `${a.hreflang}=${a.href}`)
    .sort()
    .join("|");
  const pg = alternates
    .map((a) => `${a.hreflang}=${a.href}`)
    .sort()
    .join("|");
  if (sm !== pg)
    F("hreflang.sitemap-match", "page hreflang set differs from the sitemap's xhtml:link set");
  rec.hreflang = alternates.length;

  // Open Graph / Twitter
  const og = (p) => meta("property", p)[0]?.content;
  const ogChecks = { "og:title": title, "og:description": description, "og:url": expected };
  for (const [prop, want] of Object.entries(ogChecks))
    if (og(prop) !== want) F(`og.${prop.slice(3)}`, `${og(prop)} != ${want}`);
  if (!["website", "article"].includes(og("og:type") || "")) F("og.type", String(og("og:type")));
  if (og("og:locale") !== (arabic ? "ar_AR" : "en_US")) F("og.locale", String(og("og:locale")));
  if (og("og:locale:alternate") !== (arabic ? "en_US" : "ar_AR"))
    F("og.locale-alternate", String(og("og:locale:alternate")));
  if (!og("og:site_name")) F("og.site_name", "missing");
  const ogImage = og("og:image");
  if (!ogImage || !ogImage.startsWith(SITE + "/")) F("og.image", `${ogImage}`);
  if (meta("name", "twitter:card")[0]?.content !== "summary_large_image")
    F("twitter.card", "not summary_large_image");
  for (const n of ["twitter:title", "twitter:description", "twitter:image"])
    if (!meta("name", n)[0]?.content) F(`twitter.${n.slice(8)}`, "missing");
  rec.og = Boolean(ogImage);

  // icons / manifest / theme-color
  const links = tagsOf(head, "link");
  if (!links.some((l) => l.rel === "icon")) F("icons.favicon", "missing");
  if (!links.some((l) => l.rel === "apple-touch-icon")) F("icons.apple-touch-icon", "missing");
  if (!links.some((l) => l.rel === "manifest")) F("icons.manifest", "missing");
  if (!meta("name", "theme-color")[0]) F("icons.theme-color", "missing");

  // headings
  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: textOf(m[2]),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  rec.h1 = h1s.length;
  if (h1s.length !== 1) F("h1.count", `${h1s.length} <h1>`);
  else if (!h1s[0].text) F("h1.empty", "empty <h1>");
  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) {
      F("headings.order", `h${prev} followed by h${h.level} ("${h.text.slice(0, 40)}")`);
      break;
    }
    prev = h.level;
  }

  // JSON-LD
  const types = [];
  const ldBlocks = [
    ...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
  rec.ld = ldBlocks.length;
  for (const raw of ldBlocks) {
    let data;
    try {
      data = JSON.parse(decode(raw));
    } catch (e) {
      F("jsonld.parse", String(e.message));
      continue;
    }
    if (data["@context"] !== "https://schema.org") F("jsonld.context", String(data["@context"]));
    walkJsonLd(data, (node) => {
      if (node["@type"]) types.push(node["@type"]);
      for (const key of ["url", "item", "@id", "logo", "image"]) {
        const v = typeof node[key] === "string" ? node[key] : null;
        if (v && /^https?:/.test(v) && !v.startsWith(SITE)) F("jsonld.origin", `${key}=${v}`);
      }
    });
    if (/localhost|127\.0\.0\.1|example\.com|placeholder|lorem ipsum/i.test(raw))
      F("jsonld.placeholder", "placeholder/localhost in JSON-LD");
    if (data["@type"] === "BreadcrumbList") {
      const items = data.itemListElement || [];
      if (!items.every((it, i) => it.position === i + 1 && it.name && it.item))
        F("jsonld.breadcrumb", "positions/name/item invalid");
      if (path !== "/" && path !== "/ar" && items[items.length - 1]?.item !== expected)
        F("jsonld.breadcrumb-last", "last crumb is not this page");
    }
    if (data["@type"] === "FAQPage") {
      const text = textOf(body);
      for (const q of data.mainEntity || [])
        if (!text.includes(q.name))
          F("jsonld.faq-visible", `question not visible on page: ${q.name}`);
    }
    if (
      data.inLanguage &&
      !(data.inLanguage === (arabic ? "ar" : "en") || Array.isArray(data.inLanguage))
    )
      F("jsonld.inLanguage", String(data.inLanguage));
  }
  const need = (t) => {
    if (!types.includes(t))
      F("jsonld.missing", `${t} not found (have: ${[...new Set(types)].join(", ")})`);
  };
  if (path === "/" || path === "/ar") {
    need("Organization");
    need("WebSite");
  } else need("BreadcrumbList");
  if (/^(\/ar)?\/services\/[^/]+$/.test(path)) need("Service");
  if (/^(\/ar)?\/work\/[^/]+$/.test(path)) need("CreativeWork");
  if (/^(\/ar)?\/contact$/.test(path)) need("FAQPage");
  rec.types = [...new Set(types)].join(",");

  // images
  const imgs = tagsOf(body, "img");
  rec.imgs = imgs.length;
  imgs.forEach((img, i) => {
    const label = (img.src || "").slice(0, 60);
    if (!("alt" in img)) F("img.alt", `missing alt attribute: ${label}`);
    else if (
      img.alt &&
      arabic &&
      !/\p{Script=Arabic}/u.test(img.alt) &&
      !/^[A-Za-z0-9 .&'-]+$/.test(img.alt)
    )
      warn(path, "img.alt-lang", `alt not Arabic: ${img.alt}`);
    const sized =
      (img.width && img.height) ||
      /aspect-/.test(img.class || "") ||
      /aspect-ratio/.test(img.style || "");
    if (!sized) warn(path, "img.dimensions", `no width/height/aspect-ratio: ${label}`);
    if (i === 0 && img.loading === "lazy")
      warn(path, "img.lcp-lazy", `first image is lazy: ${label}`);
  });

  // placeholders in the head
  if (
    /localhost|127\.0\.0\.1|lorem ipsum/i.test(
      head.replace(/<link[^>]+rel="preconnect"[^>]*>/g, ""),
    )
  )
    F("head.placeholder", "localhost/placeholder in <head>");
  // mixed content
  const mixed = [...html.matchAll(/(?:src|href)="(http:\/\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !/127\.0\.0\.1|localhost|www\.w3\.org/.test(u));
  if (mixed.length) F("security.mixed-content", mixed.slice(0, 3).join(", "));

  // links
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const a = parseAttrs("<a " + m[1] + ">");
    if (!a.href) continue;
    const text = textOf(m[2]) || a["aria-label"] || "";
    const imgAlt = (m[2].match(/<img[^>]*\balt="([^"]*)"/) || [])[1];
    rec.links.push({
      href: a.href,
      text: text || imgAlt || "",
      rel: a.rel || "",
      target: a.target || "",
    });
  }
  return rec;
}

function auditLinks() {
  const targets = new Map(); // normalized internal path -> [from]
  const inbound = new Map();
  for (const rec of pages.values()) {
    if (rec.status !== 200) continue;
    const arabic = isArabicPath(rec.path);
    for (const l of rec.links) {
      const F = (rule, detail) => {
        rec.issues++;
        fail(rec.path, rule, detail);
      };
      const href = l.href;
      if (/^(mailto:|tel:|javascript:|#)/.test(href)) {
        if (/^javascript:/.test(href)) F("link.javascript", href);
        continue;
      }
      let url;
      try {
        url = new URL(href, SITE + rec.path);
      } catch {
        F("link.invalid", href);
        continue;
      }
      const internal = url.origin === SITE || url.origin === new URL(BASE).origin;
      if (!internal) {
        if (!/noopener/.test(l.rel) || !/noreferrer/.test(l.rel))
          F("link.external-rel", `${href} rel="${l.rel}"`);
        continue;
      }
      if (href.startsWith("http") && url.origin !== SITE)
        F("link.absolute-origin", `${href} should be relative or ${SITE}`);
      let p = url.pathname.replace(/\/+$/, "") || "/";
      if (url.pathname !== "/" && url.pathname.endsWith("/")) F("link.trailing-slash", href);
      if (/\.(png|jpe?g|svg|webp|json|xml|txt|pdf|webmanifest|ico)$/i.test(p)) continue;
      const toArabic = isArabicPath(p);
      if (toArabic !== arabic && p !== counterpart(rec.path))
        F(
          "link.language",
          `${href} leaves the ${arabic ? "Arabic" : "English"} site (only the language switcher may)`,
        );
      if (!l.text) F("link.text", `no accessible text: ${href}`);
      else if (GENERIC_LINK_TEXT.has(l.text.toLowerCase()))
        F("link.generic-text", `"${l.text}" -> ${href}`);
      if (!targets.has(p)) targets.set(p, []);
      targets.get(p).push(rec.path);
      if (p !== rec.path) {
        if (!inbound.has(p)) inbound.set(p, new Set());
        inbound.get(p).add(rec.path);
      }
    }
  }
  return { targets, inbound };
}

async function checkLinkTargets(targets) {
  const dead = [];
  for (const [p, from] of targets) {
    const known = pages.get(p);
    if (known) {
      if (known.status !== 200) dead.push({ p, status: known.status, from: from[0] });
      continue;
    }
    const res = await get(p);
    await res.arrayBuffer();
    if (res.status !== 200) dead.push({ p, status: res.status, from: from[0] });
  }
  for (const d of dead) fail(d.from, "link.status", `${d.p} -> ${d.status}`);
  return dead.length;
}

async function auditAssets() {
  // OG image, icons, manifest
  const og = await get("/og/wijhan-en.png");
  const ogBuf = Buffer.from(await og.arrayBuffer());
  const size = pngSize(ogBuf);
  if (og.status !== 200 || !size || size.width !== 1200 || size.height !== 630)
    fail("/og/wijhan-en.png", "og.image-size", `status ${og.status}, ${JSON.stringify(size)}`);
  const ogAr = await get("/og/wijhan-ar.png");
  await ogAr.arrayBuffer();
  if (ogAr.status !== 200) fail("/og/wijhan-ar.png", "og.image-ar", String(ogAr.status));
  const manifestRes = await get("/site.webmanifest");
  try {
    const manifest = JSON.parse(await manifestRes.text());
    for (const icon of manifest.icons || []) {
      const r = await get(icon.src);
      await r.arrayBuffer();
      if (r.status !== 200)
        fail("/site.webmanifest", "manifest.icon", `${icon.src} -> ${r.status}`);
    }
    if (!manifest.name || !manifest.start_url)
      fail("/site.webmanifest", "manifest.fields", "name/start_url missing");
  } catch (e) {
    fail("/site.webmanifest", "manifest.parse", String(e.message));
  }
  for (const p of ["/favicon.png", "/apple-touch-icon.png"]) {
    const r = await get(p);
    await r.arrayBuffer();
    if (r.status !== 200) fail(p, "icons.reachable", String(r.status));
  }
  // security headers + no public source maps
  const home = await get("/");
  const hsts = home.headers.get("strict-transport-security") || "";
  if (!/max-age=\d{7,}/.test(hsts)) fail("/", "security.hsts", hsts || "missing");
  const homeHtml = await home.text();
  const scripts = [...homeHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  const uniqueScripts = [...new Set(scripts)].slice(0, 12);
  for (const s of uniqueScripts) {
    const r = await get(s);
    const js = await r.text();
    if (/\/\/# sourceMappingURL=/.test(js))
      fail(s, "security.sourcemap-ref", "bundle references a source map");
    const map = await get(s + ".map");
    await map.arrayBuffer();
    if (map.status === 200)
      fail(s + ".map", "security.sourcemap-public", "source map is publicly reachable");
    const cc = r.headers.get("cache-control") || "";
    if (!/immutable/.test(cc))
      warn(
        s,
        "cache.assets",
        `hashed asset without immutable Cache-Control (${cc || "none"}; edge/_headers must add it)`,
      );
  }
  const cssRes = await get(homeHtml.match(/href="(\/assets\/[^"]+\.css)"/)?.[1] || "/");
  await cssRes.arrayBuffer();
}

// ---------- main ----------
async function main() {
  const started = Date.now();
  console.log(`SEO audit — base ${BASE}\n`);
  await auditRobots();
  const entries = await loadSitemap();
  if (!entries.length) {
    fail("/sitemap.xml", "sitemap.empty", "no <url> entries");
  }
  for (const entry of entries) await auditPage(entry);

  // uniqueness across pages
  for (const field of ["title", "description"]) {
    const seen = new Map();
    for (const rec of pages.values()) {
      if (!rec[field]) continue;
      if (seen.has(rec[field]))
        fail(
          rec.path,
          `${field}.unique`,
          `same as ${seen.get(rec[field])}: "${rec[field].slice(0, 60)}"`,
        );
      else seen.set(rec[field], rec.path);
    }
  }

  // hreflang reciprocity as served in the HTML: each page's partner must exist and point back
  // (checked structurally above through the expected en/ar/x-default URLs, which both pages share).

  const { targets, inbound } = auditLinks();
  const deadLinks = await checkLinkTargets(targets);
  for (const entry of entries) {
    const p = new URL(entry.loc).pathname || "/";
    if (p !== "/" && !inbound.has(p)) fail(p, "links.orphan", "no other crawled page links here");
  }
  await auditStatusAndRedirects();
  await auditAssets();

  // ---------- report ----------
  const rows = [...pages.values()].map((r) => {
    const bad = failures.filter((f) => f.page === r.path).length;
    return {
      path: r.path,
      status: r.status,
      title: r.title ? len(r.title) : "-",
      desc: r.description ? len(r.description) : "-",
      h1: r.h1 ?? "-",
      hreflang: r.hreflang ?? "-",
      og: r.og ? "yes" : "no",
      ld: r.types || "-",
      imgs: r.imgs,
      links: r.links.length,
      result: bad ? `FAIL(${bad})` : "ok",
    };
  });
  console.table(rows);
  console.log(
    `pages crawled: ${rows.length} · internal link targets checked: ${targets.size} (dead: ${deadLinks}) · ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );

  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}, do not fail the audit):`);
    const grouped = {};
    for (const w of warnings) (grouped[w.rule] ||= []).push(`${w.page}: ${w.detail}`);
    for (const [rule, list] of Object.entries(grouped)) {
      console.log(`  - ${rule} ×${list.length}`);
      list.slice(0, 4).forEach((l) => console.log(`      ${l}`));
    }
  }
  if (JSON_OUT)
    fs.writeFileSync(JSON_OUT, JSON.stringify({ base: BASE, rows, failures, warnings }, null, 2));

  if (failures.length) {
    console.log(`\nFAILURES (${failures.length}):`);
    for (const f of failures) console.log(`  ✗ [${f.rule}] ${f.page} — ${f.detail}`);
    console.log("\nSEO audit FAILED");
    process.exit(1);
  }
  console.log("\nSEO audit passed ✓");
}

main().catch((error) => {
  console.error("SEO audit crashed:", error);
  process.exit(2);
});
