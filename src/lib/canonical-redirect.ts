/**
 * One canonical URL form for the whole site: https, www, no trailing slash.
 *
 * Every violating request is answered with a single 301 straight to the final URL — never a
 * chain (http://wijhan.com/work/ → https://www.wijhan.com/work in one hop, not three). The
 * edge (Cloudflare/Nginx, see docs/hosting) should do this first; this is the backstop for any
 * request that reaches the app directly.
 *
 * Host/scheme rules only apply to the real production hosts, so localhost, preview URLs and
 * `*.workers.dev` are never redirected away.
 */

const CANONICAL_HOST = "www.wijhan.com";
const APEX_HOST = "wijhan.com";

/**
 * URLs that existed before and are gone (removed from git history): permanent redirects to
 * their closest live page, so inbound links and indexed URLs keep their value instead of
 * turning into 404s. The old /pricing page was replaced by the quote form ("Project Scoping")
 * on the contact page.
 */
export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  "/pricing": "/contact",
  "/ar/pricing": "/ar/contact",
};
export function canonicalRedirect(request: Request): string | null {
  // Only safe, idempotent requests are redirected; never a POST (server functions, forms).
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return null;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = (forwardedHost || url.host).toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto ? `${forwardedProto}:` : url.protocol;

  const onProductionHost = host === CANONICAL_HOST || host === APEX_HOST;
  let changed = false;

  let targetHost = host;
  let targetProtocol = protocol;
  if (onProductionHost) {
    if (host === APEX_HOST) {
      targetHost = CANONICAL_HOST;
      changed = true;
    }
    if (protocol !== "https:") {
      targetProtocol = "https:";
      changed = true;
    }
  }

  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "") || "/";
    changed = true;
  }

  const legacyTarget = LEGACY_REDIRECTS[pathname.toLowerCase()];
  if (legacyTarget) {
    pathname = legacyTarget;
    changed = true;
  }

  if (!changed) return null;
  return `${targetProtocol}//${targetHost}${pathname}${url.search}`;
}
