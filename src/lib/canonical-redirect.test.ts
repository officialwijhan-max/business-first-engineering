import { describe, expect, it } from "vitest";
import { cacheControlFor, withCacheHeaders } from "./cache-headers";
import { canonicalRedirect } from "./canonical-redirect";

const req = (url: string, headers: Record<string, string> = {}, method = "GET") =>
  new Request(url, { method, headers });

describe("canonicalRedirect", () => {
  it("leaves canonical URLs alone", () => {
    expect(canonicalRedirect(req("https://www.wijhan.com/"))).toBeNull();
    expect(canonicalRedirect(req("https://www.wijhan.com/ar/work/x?tab=1"))).toBeNull();
  });

  it("sends the apex domain to www in one hop", () => {
    expect(canonicalRedirect(req("https://wijhan.com/about"))).toBe("https://www.wijhan.com/about");
  });

  it("sends http to https in one hop, including behind a proxy", () => {
    expect(canonicalRedirect(req("http://www.wijhan.com/about"))).toBe(
      "https://www.wijhan.com/about",
    );
    expect(
      canonicalRedirect(
        req("http://127.0.0.1/about", {
          "x-forwarded-host": "www.wijhan.com",
          "x-forwarded-proto": "http",
        }),
      ),
    ).toBe("https://www.wijhan.com/about");
  });

  it("strips trailing slashes and keeps the query string", () => {
    expect(canonicalRedirect(req("https://www.wijhan.com/work/?cat=erp"))).toBe(
      "https://www.wijhan.com/work?cat=erp",
    );
    expect(canonicalRedirect(req("https://www.wijhan.com/ar/"))).toBe("https://www.wijhan.com/ar");
  });

  it("combines every violation into a single redirect (no chains)", () => {
    expect(canonicalRedirect(req("http://wijhan.com/services/erp-solutions/"))).toBe(
      "https://www.wijhan.com/services/erp-solutions",
    );
  });

  it("never redirects other hosts or non-GET requests", () => {
    expect(canonicalRedirect(req("http://localhost:3000/work/"))).toBe(
      "http://localhost:3000/work",
    );
    expect(canonicalRedirect(req("http://localhost:3000/work"))).toBeNull();
    expect(canonicalRedirect(req("https://app.workers.dev/"))).toBeNull();
    expect(canonicalRedirect(req("https://wijhan.com/work/", {}, "POST"))).toBeNull();
  });
});

describe("cache headers", () => {
  it("caches HTML briefly, never caches 5xx", () => {
    expect(cacheControlFor(200, "text/html; charset=utf-8")).toContain("max-age=0");
    expect(cacheControlFor(200, "text/html")).toContain("s-maxage=300");
    expect(cacheControlFor(404, "text/html")).toBe("public, max-age=0, s-maxage=60");
    expect(cacheControlFor(500, "text/html")).toBe("no-store");
    expect(cacheControlFor(503, "application/xml")).toBe("no-store");
    expect(cacheControlFor(200, "application/json")).toBeNull();
  });

  it("does not overwrite a Cache-Control a route already set", () => {
    const response = new Response("x", {
      headers: { "content-type": "text/html", "cache-control": "no-cache" },
    });
    expect(withCacheHeaders(response).headers.get("cache-control")).toBe("no-cache");
  });
});
