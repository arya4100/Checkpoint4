// registerStudent.ts - calls POST /api/register.
import { request } from './apiClient'
import type { RegisterData } from '../types'

/**
 * Registers a new student.
 * @param data - values from the registration form
 * @returns the success message from the server
 */
export async function registerStudent(data: RegisterData): Promise<string> {
  const result = await request<{ message: string }>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return result.message
}
