import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "../../../packages/ui/src/styles/globals.css";
import {
  authService,
  setRefreshHandler,
  setTokenGetter,
  setUnauthorizedHandler,
} from "@workspace/api-client";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider";
import { useAuthStore } from "./features/auth/stores/auth-store";
import { routeTree } from "./routeTree.gen";

// Initialize API client
setTokenGetter(() => useAuthStore.getState().accessToken);
setUnauthorizedHandler(() => useAuthStore.getState().logout());
setRefreshHandler(async () => {
  try {
    const response = await authService.refreshToken();
    if (response.accessToken) {
      useAuthStore.getState().setAccessToken(response.accessToken);
      return response.accessToken;
    }
  } catch (error) {
    useAuthStore.getState().logout();
    throw error;
  }
  return null;
});

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
