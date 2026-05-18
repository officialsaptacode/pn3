import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import React, { Suspense, useEffect } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

import { authApi } from "@/features/auth/api/auth";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-background min-h-[50vh]">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-destructive mb-2">
            Application Error
          </h2>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred while rendering this route.
          </p>
          <div className="bg-muted/50 border rounded-md p-4 mb-6 overflow-auto max-h-[400px]">
            <pre className="text-sm text-foreground/80 font-mono whitespace-pre-wrap">
              {props.error?.message || String(props.error) || "Unknown error"}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  },
});

function RootComponent() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Attempt to restore session on mount (e.g. refresh token)
  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        try {
          const data = await authApi.refreshToken();
          if (data?.accessToken) {
            setAuth(
              {
                id: 0, // Placeholder
                userName: "User", // Placeholder
                email: "",
                role: data.role,
              },
              data.accessToken,
            );
          }
        } catch (_e) {
          // check failed, user stays logged out
        }
      }
    };
    initAuth();
  }, [setAuth, isAuthenticated]);

  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}
