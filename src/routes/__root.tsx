import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  Navigate,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import appCss from "../styles.css?url";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "fisiobot" },
      {
        name: "description",
        content:
          "Web Portal Gateway provides a user interface for managing patient data, financial information, and system reports.",
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "fisiobot" },
      {
        property: "og:description",
        content:
          "Web Portal Gateway provides a user interface for managing patient data, financial information, and system reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "fisiobot" },
      {
        name: "twitter:description",
        content:
          "Web Portal Gateway provides a user interface for managing patient data, financial information, and system reports.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5c510bc9-f1e9-46f1-98c2-254f0e232f78/id-preview-09ad552b--8147f2c4-ad84-4b81-9af7-c5735362c4c1.lovable.app-1778605511085.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5c510bc9-f1e9-46f1-98c2-254f0e232f78/id-preview-09ad552b--8147f2c4-ad84-4b81-9af7-c5735362c4c1.lovable.app-1778605511085.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toaster />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const location = useRouterState({ select: (r) => r.location });
  const pathname = location.pathname;
  const publicRoute = pathname === "/login" || pathname === "/app-login";
  const session = useQuery({
    queryKey: ["auth-session"],
    queryFn: api.auth.session,
    retry: false,
    staleTime: 30_000,
  });

  if (publicRoute) {
    return <Outlet />;
  }

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="rounded-md border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Verificando sessao...
        </div>
      </div>
    );
  }

  if (session.data?.authRequired !== false && !session.data?.authenticated) {
    return <Navigate to="/app-login" search={{ redirect: `${pathname}${location.searchStr}` }} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Topbar
            userName={session.data.user?.nomeCompleto || session.data.user?.login || "Usuario"}
          />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
