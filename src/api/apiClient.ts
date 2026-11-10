// apiClient.ts - one small fetch wrapper used by every API call.
// "/api" is forwarded to the Express server by the proxy in vite.config.ts.

const API_BASE = '/api'

/** Error that also carries the HTTP status code (0 = server could not be reached). */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/**
 * Sends a JSON request and returns the parsed JSON response.
 * Throws an ApiError with the server's message when the response is not OK.
 * @param path - e.g. "/login"
 * @param options - normal fetch options (method, body, headers ...)
 */
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(API_BASE + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    // fetch only throws when the server cannot be reached (offline / server stopped)
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(data.message || 'Something went wrong.', response.status)
  return data as T
}
