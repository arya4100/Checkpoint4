// Auth.ts - client side JWT helpers: store, read, check and remove the token.

const TOKEN_KEY = 'student_token'

/** Saves the JWT in localStorage after a successful login. */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Returns the saved JWT, or null when nobody is logged in. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Deletes the JWT (used for logout). */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Reads the expiry time ("exp", in seconds) from the middle part of the JWT.
 * This only reads the token - the server is what really verifies it.
 */
function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ?? 0
  } catch {
    return 0 // malformed token is treated as expired
  }
}

/** True when a token exists and has not expired yet. */
export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  const stillValid = getTokenExpiry(token) * 1000 > Date.now()
  if (!stillValid) removeToken() // clean up expired token
  return stillValid
}

/** Logs the student out. */
export function logout(): void {
  removeToken()
}
