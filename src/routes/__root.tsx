import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import dmSansLatinUrl from "../assets/fonts/dm-sans-latin.woff2?url";
import plexArabic400Url from "../assets/fonts/ibm-plex-sans-arabic-400.woff2?url";
import plexArabic700Url from "../assets/fonts/ibm-plex-sans-arabic-700.woff2?url";
import { API_BASE_URL } from "../api/config";
import { servicesQueryOptions } from "../hooks/use-services";
import { workQueryOptions } from "../hooks/use-work";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingContactButtons, SiteFooter, SiteHeader } from "../components/site-shell";
import { TerminalCTA } from "../components/terminal-cta";

// Exported so router.tsx can also register it as `defaultNotFoundComponent` —
// a route-level `notFoundComponent` on the root route only covers paths that
// fail to match while resolving from the root; a path nested under a layout
// route (e.g. /ar/<bogus>) resolves its "not found" against that layout's
// own boundary instead, which falls back to the router's bare built-in
// default unless `defaultNotFoundComponent` is also set.
function apiOrigin(): string | null {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return null;
  }
}
const API_ORIGIN = apiOrigin();

function isArabicPath(pathname: string) {
  return pathname === "/ar" || pathname.startsWith("/ar/");
}

export function NotFoundComponent() {
  // No route matched here, so there is no head() to set page metadata —
  // React 19 hoists <title>/<meta> rendered anywhere in the tree into
  // <head>, which is the only way to give this page a real title/description.
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <title>{arabic ? "الصفحة غير موجودة | وجهان" : "Page Not Found | Wijhan"}</title>
      <meta
        name="description"
        content={
          arabic
            ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : "The page you're looking for doesn't exist or has been moved."
        }
      />
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {arabic ? "الصفحة غير موجودة" : "Page not found"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {arabic
            ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="mt-6">
          <Link
            to={arabic ? "/ar" : "/"}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {arabic ? "الذهاب إلى الرئيسية" : "Go home"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background px-4"
      dir={arabic ? "rtl" : undefined}
      lang={arabic ? "ar" : undefined}
    >
      <title>{arabic ? "تعذّر تحميل الصفحة | وجهان" : "Something went wrong | Wijhan"}</title>
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {arabic ? "تعذّر تحميل هذه الصفحة" : "This page didn't load"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {arabic
            ? "حدث خطأ من جانبنا. يمكنك إعادة تحميل الصفحة أو العودة إلى الصفحة الرئيسية."
            : "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {arabic ? "إعادة المحاولة" : "Try again"}
          </button>
          <a
            href={arabic ? "/ar" : "/"}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {arabic ? "الذهاب إلى الرئيسية" : "Go home"}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // viewport-fit=cover lets the layout extend under the notch / Dynamic Island and
      // home indicator; styles.css then pads the header, gutters, floating buttons,
      // and footer with env(safe-area-inset-*) so nothing is hidden behind them.
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0F1B2E" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
      // Self-hosted brand font, needed by every page's first paint (Arabic faces are
      // preloaded per-page in RootShell). crossOrigin is mandatory for font preloads, even
      // same-origin, or the browser fetches the file twice.
      {
        rel: "preload",
        href: dmSansLatinUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      // The API origin is contacted on every page (shell nav data, forms); warm it up early.
      ...(API_ORIGIN
        ? [{ rel: "preconnect", href: API_ORIGIN, crossOrigin: "anonymous" as const }]
        : []),
    ],
  }),
  // Header/footer render API-backed service and work links on every page, so warm that data
  // in SSR for the active language: the links are then in the HTML crawlers receive. A failure
  // here must never break a page (static pages stay fully usable), hence the swallowed errors.
  loader: async ({ context: { queryClient }, location }) => {
    const locale = isArabicPath(location.pathname) ? "ar" : "en";
    await Promise.all([
      queryClient.ensureQueryData(servicesQueryOptions(locale)).catch(() => null),
      queryClient.ensureQueryData(workQueryOptions(locale)).catch(() => null),
    ]);
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const ARABIC_FONT_PRELOADS = [plexArabic400Url, plexArabic700Url];

function RootShell({ children }: { children: ReactNode }) {
  // The server-rendered <html> must already carry lang/dir for Arabic URLs: the effect in
  // RootComponent only runs after hydration, so crawlers, no-JS clients and the first paint
  // would otherwise get lang="en" with no direction.
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");

  return (
    <html lang={arabic ? "ar" : "en"} dir={arabic ? "rtl" : undefined}>
      <head>
        <HeadContent />
        {/* IBM Plex Sans Arabic is only needed (and only preloaded) on /ar pages. */}
        {arabic
          ? ARABIC_FONT_PRELOADS.map((href) => (
              <link
                key={href}
                rel="preload"
                href={href}
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
              />
            ))
          : null}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");

  useEffect(() => {
    document.documentElement.lang = arabic ? "ar" : "en";
    document.documentElement.dir = arabic ? "rtl" : "ltr";
  }, [arabic]);

  return (
    <QueryClientProvider client={queryClient}>
      <div dir={arabic ? "rtl" : "ltr"} lang={arabic ? "ar" : "en"}>
        <a className="skip-link" href="#main-content">
          {arabic ? "انتقل إلى المحتوى" : "Skip to content"}
        </a>
        <SiteHeader />
        <main id="main-content" className="pt-(--header-h)">
          <Outlet />
        </main>
        <TerminalCTA />
        <SiteFooter />
        <FloatingContactButtons />
      </div>
    </QueryClientProvider>
  );
}
