import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRootRoute, createRouter } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type React from "react";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";

// Create a custom render function with Providers
export function renderWithProviders(ui: ReactElement, options = {}): ReturnType<typeof render> {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  const rootRoute = createRootRoute({
    component: () => ui,
  });

  const routeTree = rootRoute.addChildren([]);

  const history = createMemoryHistory({
    initialEntries: ["/"],
  });

  const _router = createRouter({
    routeTree,
    history,
    context: { queryClient },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {/* We use the component directly rather than RouterProvider for simpler tests, 
            but provide RouterProvider if specific router features are needed. 
            For component tests, providing just QueryClient is usually enough unless they use Link/useNavigate. */}
        {children}
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Wrapper for testing React Hook Form fields directly
export function withFormProvider(ui: ReactElement, defaultValues: any = {}) {
  const Wrapper = () => {
    const methods = useForm({ defaultValues });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>{ui}</form>
      </FormProvider>
    );
  };

  return <Wrapper />;
}
