// getProfile.ts - calls the protected GET /api/profile route with the JWT.
import { request } from './apiClient'
import { getToken } from '../auth/Auth'
import type { Profile } from '../types'

/**
 * Loads the logged in student's profile.
 * @returns the profile (name, e-mail, contact number, gender)
 */
export async function getProfile(): Promise<Profile> {
  return request<Profile>('/profile', {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
}
