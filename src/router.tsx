import { QueryClient, dehydrate, hydrate, type DehydratedState } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ErrorComponent, NotFoundComponent } from "./routes/__root";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Services/work change rarely and the API caches them too: don't refetch on every
        // tab focus or remount, and retry a failed read only once in the browser. On the
        // server a retry would double the time a visitor waits when the API is down.
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: typeof window === "undefined" ? 0 : 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Route loaders prefetch into this QueryClient on the server. Ship that cache
    // to the browser so the first client render matches the SSR HTML; without it
    // React throws a hydration mismatch and re-renders the whole tree.
    // The router only accepts provably-serializable values; a dehydrated query
    // cache is plain JSON, but React Query types its keys as `unknown`.
    dehydrate: () => ({ queryClientState: dehydrate(queryClient) as unknown as Json }),
    hydrate: (data: { queryClientState: Json }) => {
      hydrate(queryClient, data.queryClientState as unknown as DehydratedState);
    },
    // Covers paths nested under a layout route (e.g. /ar/<bogus>) whose
    // "not found" resolves against that layout's own boundary rather than
    // the root route — see the comment on NotFoundComponent itself.
    defaultNotFoundComponent: NotFoundComponent,
    // Same for loader errors (e.g. API down on /work/:slug): without this, child routes fall
    // back to the router's bare built-in error UI instead of the localized, noindex error page.
    defaultErrorComponent: ErrorComponent,
  });

  return router;
};
