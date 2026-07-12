// Typed fetch wrapper for the backend API.
//
// - credentials: "include" sends the httpOnly auth cookies automatically.
// - Non-2xx responses throw an ApiError carrying the server's message/status,
//   so TanStack Query surfaces them as errors.
// - The API wraps payloads as { data: ... }; helpers unwrap that for callers.

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? "GET",
      credentials: "include",
      headers: opts.body ? { "Content-Type": "application/json" } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch {
    throw new ApiError(0, "Network error — is the API running?", "NETWORK");
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error ?? res.statusText,
      json?.code,
      json?.details,
    );
  }

  // API convention: successful reads/writes return { data: ... }; auth returns { user }.
  return (json?.data ?? json) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
