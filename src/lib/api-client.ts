type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  // Pass through when calling from a Server Component / layout, where
  // fetch needs the incoming request's cookies forwarded manually.
  cookieHeader?: string;
  cache?: RequestCache;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, cookieHeader, cache = 'no-store' } = options;

  const isServer = typeof window === 'undefined';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(isServer && cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    // Browser-side: send the session cookie cross-origin.
    // Server-side: cookies are forwarded manually via the Cookie header above.
    credentials: isServer ? 'omit' : 'include',
    cache,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as ApiSuccess<T> | ApiFailure;

  if (!json.success) {
    throw new ApiError(json.message, res.status);
  }

  return json.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
