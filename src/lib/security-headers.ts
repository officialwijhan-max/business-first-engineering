import { API_BASE_URL } from "@/api/config";

/**
 * Security headers applied to every server-rendered response (see server.ts).
 * Static assets get the non-CSP subset via public/_headers.
 *
 * The CSP ships in REPORT-ONLY mode first: browsers log violations to the
 * console without blocking anything. After a clean pass over every page in
 * both languages (and the contact/quote forms), flip CSP_ENFORCE to true.
 */
export const CSP_ENFORCE = false;

function apiOrigin(): string | null {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return null;
  }
}

export function buildContentSecurityPolicy(): string {
  const connect = ["'self'", apiOrigin()].filter(Boolean).join(" ");

  const directives: Record<string, string> = {
    "default-src": "'self'",
    // TanStack Start streams inline bootstrap/hydration scripts, so 'unsafe-inline'
    // is required until a per-request nonce is wired through the router.
    "script-src": "'self' 'unsafe-inline'",
    // Inline style attributes are used in components. Fonts are self-hosted (src/assets/fonts),
    // so no third-party style or font origin is needed.
    "style-src": "'self' 'unsafe-inline'",
    "font-src": "'self' data:",
    // API-supplied case-study images can live on the API/CDN host, hence https:.
    "img-src": "'self' data: https:",
    "connect-src": connect,
    "frame-ancestors": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "object-src": "'none'",
    // Browsers ignore this directive in Report-Only mode and log a console error saying so.
    ...(CSP_ENFORCE ? { "upgrade-insecure-requests": "" } : {}),
  };

  return Object.entries(directives)
    .map(([name, value]) => (value ? `${name} ${value}` : name))
    .join("; ");
}

export function securityHeaders(): Record<string, string> {
  return {
    [CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only"]:
      buildContentSecurityPolicy(),
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  };
}

/** Returns a copy of the response with security headers added (existing values win). */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders())) {
    if (!headers.has(name)) headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
