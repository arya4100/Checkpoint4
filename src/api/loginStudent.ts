// loginStudent.ts - calls POST /api/login and stores the JWT on success.
import { request } from './apiClient'
import { saveToken } from '../auth/Auth'
import type { LoginData, LoginResponse, Student } from '../types'

/**
 * Logs a student in.
 * @param data - e-mail and password
 * @returns the logged in student's basic details
 */
export async function loginStudent(data: LoginData): Promise<Student> {
  const result = await request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  saveToken(result.token) // keep the JWT so later requests can use it
  return result.student
}
