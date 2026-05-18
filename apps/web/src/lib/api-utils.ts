import type { ApiResponse } from "@workspace/api-client";

/**
 * Safely unwraps ApiResponse<T> to extract the data property
 * Handles various response shapes gracefully
 */
export function unwrapResponse<T>(response: ApiResponse<T> | T | null | undefined): T | null {
  if (response === null || response === undefined) {
    return null;
  }

  // If it's an ApiResponse shape with data property
  if (typeof response === "object" && "data" in response && response.data !== undefined) {
    return response.data as T;
  }

  // Otherwise assume it's the direct data
  return response as T;
}

/**
 * Safely unwraps an array response, always returning an array
 */
export function unwrapArray<T>(response: ApiResponse<T[]> | T[] | null | undefined): T[] {
  const data = unwrapResponse(response);
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

/**
 * Safely unwraps a single item response
 */
export function unwrapItem<T>(response: ApiResponse<T> | T | null | undefined): T | null {
  const data = unwrapResponse(response);
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data;
}

/**
 * Extracts value from a PromiseSettledResult safely
 */
export function getSettledValue<T>(
  result: PromiseSettledResult<T> | undefined | null,
  fallback: T,
): T {
  if (!result) return fallback;
  if (result.status === "fulfilled") {
    return result.value;
  }
  console.error("Promise rejected:", result.reason);
  return fallback;
}

/**
 * Type guard to check if value is ApiResponse
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return typeof value === "object" && value !== null && "data" in value && value.data !== undefined;
}

/**
 * Extracts metadata from ApiResponse if available
 */
export function getResponseMeta(
  response: unknown,
): { total?: number; page?: number; limit?: number; totalPages?: number } | null {
  if (!isApiResponse(response)) return null;
  return response.meta ?? null;
}
