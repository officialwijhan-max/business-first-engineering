/**
 * Cache-Control for server-rendered responses (static, content-hashed assets get theirs from
 * public/_headers). Rules, unless a route already set its own header:
 *
 * - HTML 2xx: browsers always revalidate (max-age=0); a shared cache/CDN may serve it for 5
 *   minutes and refresh in the background. Short on purpose — pages embed live API data.
 * - HTML 404: cached briefly at the edge so a crawler hammering dead URLs doesn't hit SSR.
 * - 5xx: never cached anywhere, so a temporary API outage is not pinned on a URL.
 */
export function cacheControlFor(status: number, contentType: string): string | null {
  if (status >= 500) return "no-store";
  if (!contentType.includes("text/html")) return null;
  if (status === 404) return "public, max-age=0, s-maxage=60";
  if (status >= 200 && status < 300) {
    return "public, max-age=0, s-maxage=300, stale-while-revalidate=600";
  }
  return null;
}

export function withCacheHeaders(response: Response): Response {
  if (response.headers.has("cache-control")) return response;
  const value = cacheControlFor(response.status, response.headers.get("content-type") ?? "");
  if (!value) return response;

  const headers = new Headers(response.headers);
  headers.set("cache-control", value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
