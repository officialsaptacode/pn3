export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  next?: { revalidate?: number; tags?: string[] };
  _retry?: boolean;
}

// Dynamic base URL getter for each request
const getDynamicBaseUrl = (): string => {
  try {
    // 1. For Vite/Browser environment (import.meta)
    if (typeof import.meta !== "undefined" && (import.meta as any).env) {
      const viteUrl =
        (import.meta as any).env.VITE_API_URL || (import.meta as any).env.VITE_BACKEND_URL;
      if (viteUrl) return viteUrl;
    }

    // 2. For Next.js/Node environment (process.env)
    if (typeof process !== "undefined" && process.env) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      if (envUrl) return envUrl;
    }
  } catch (_e) {
    // ignore errors
  }

  return "http://localhost:5000";
};

let tokenGetter: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setTokenGetter = (getter: () => string | null) => {
  tokenGetter = getter;
};

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

export const setRefreshHandler = (handler: () => Promise<string | null>) => {
  refreshHandler = handler;
};

function buildUrl(endpoint: string, params?: FetchOptions["params"]): string {
  const baseUrl = getDynamicBaseUrl().replace(/\/$/, "");
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Avoid double /api prefixing if baseUrl already includes it
  if (baseUrl.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }

  let url = `${baseUrl}${cleanEndpoint}`;
  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  return url;
}

async function handleErrorResponse(response: Response): Promise<never> {
  if (response.status === 401 && unauthorizedHandler) {
    unauthorizedHandler();
  }
  let errorMessage = `Error: ${response.status} ${response.statusText}`;
  try {
    const errorBody = await response.json();
    if (errorBody?.message) {
      errorMessage = errorBody.message;
    }
  } catch (_e) {
    // Ignore if body is not JSON
  }
  throw new Error(errorMessage);
}

async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  const url = buildUrl(endpoint, params);

  // Debug log for SSR
  if (typeof window === "undefined") {
    console.log(`[API-CLIENT SSR] Fetching: ${url}`);
    console.log(
      `[API-CLIENT SSR] NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || "not set"}`,
    );
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (tokenGetter) {
    const token = tokenGetter();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (customConfig.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include", // Required for cross-origin cookie handling
    // Default 30s timeout if not specified (and if AbortSignal is available)
    signal:
      customConfig.signal ||
      (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
        ? AbortSignal.timeout(30000)
        : undefined),
  };
  const response = await fetch(url, config);

  // Handle 401 Unauthorized with token refresh mechanism
  if (response.status === 401 && refreshHandler && !options._retry) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshHandler();
      }

      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        // Retry the original request with the new token
        return fetchClient<T>(endpoint, { ...options, _retry: true });
      }
    } catch (error) {
      refreshPromise = null;
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
      throw error;
    }
  }

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  // Handle empty responses (e.g. 204)
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return data as T;
}

export const httpClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: FetchOptions) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return fetchClient<T>(endpoint, {
      ...options,
      body: isFormData ? body : JSON.stringify(body),
      method: "POST",
    });
  },

  put: <T>(endpoint: string, body: any, options?: FetchOptions) => {
    return fetchClient<T>(endpoint, {
      ...options,
      body: JSON.stringify(body),
      method: "PUT",
    });
  },

  patch: <T>(endpoint: string, body: any, options?: FetchOptions) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return fetchClient<T>(endpoint, {
      ...options,
      body: isFormData ? body : JSON.stringify(body),
      method: "PATCH",
    });
  },

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "DELETE" }),
};

export const apiClient = httpClient;
