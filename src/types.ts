// types.ts - shared TypeScript types used by the UI, API and auth files.

/** Data typed into the registration form. */
export interface RegisterData {
  name: string
  email: string
  contactNumber: string
  gender: string
  password: string
  confirmPassword: string
}

/** Data typed into the login form. */
export interface LoginData {
  email: string
  password: string
}

/** Student details returned by the server after login. */
export interface Student {
  id: number
  name: string
  email: string
}

/** Server response for POST /api/login. */
export interface LoginResponse {
  message: string
  token: string
  student: Student
}

/** Server response for GET /api/profile. */
export interface Profile extends Student {
  contactNumber: string
  gender: string
}

/** Field name -> error message. Empty object means the form is valid. */
export type FormErrors = Partial<Record<keyof RegisterData, string>>
