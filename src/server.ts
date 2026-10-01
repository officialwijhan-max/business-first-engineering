import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { canonicalRedirect } from "./lib/canonical-redirect";
import { renderErrorPage } from "./lib/error-page";
import { withCacheHeaders } from "./lib/cache-headers";
import { withSecurityHeaders } from "./lib/security-headers";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  pathname: string,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(pathname), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function requestPathname(request: Request): string {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "/";
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Wrong host/scheme/trailing slash: one 301 to the canonical URL, before any rendering.
    const redirectTo = canonicalRedirect(request);
    if (redirectTo) {
      return withSecurityHeaders(
        new Response(null, {
          status: 301,
          headers: { location: redirectTo, "cache-control": "public, max-age=86400" },
        }),
      );
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withCacheHeaders(
        withSecurityHeaders(
          await normalizeCatastrophicSsrResponse(response, requestPathname(request)),
        ),
      );
    } catch (error) {
      console.error(error);
      return withCacheHeaders(
        withSecurityHeaders(
          new Response(renderErrorPage(requestPathname(request)), {
            status: 500,
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
        ),
      );
    }
  },
};
