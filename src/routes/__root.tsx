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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingContactButtons, SiteFooter, SiteHeader } from "../components/site-shell";
import { TerminalCTA } from "../components/terminal-cta";

// Exported so router.tsx can also register it as `defaultNotFoundComponent` —
// a route-level `notFoundComponent` on the root route only covers paths that
// fail to match while resolving from the root; a path nested under a layout
// route (e.g. /ar/<bogus>) resolves its "not found" against that layout's
// own boundary instead, which falls back to the router's bare built-in
// default unless `defaultNotFoundComponent` is also set.
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Google Fonts CSS is split by unicode-range, so the Arabic face is only downloaded once
// Arabic glyphs are actually rendered. It is added on /ar pages only (English pages
// are unchanged). display=swap: text is shown immediately in the fallback, then swaps.
const ARABIC_FONT_CSS =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap";

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
        {arabic ? <link rel="stylesheet" href={ARABIC_FONT_CSS} /> : null}
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
