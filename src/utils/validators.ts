// validators.ts - form validation rules shared by the Registration and Login pages.
import type { FormErrors, LoginData, RegisterData } from '../types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9]{7,15}$/

/**
 * Validates the registration form.
 * @param data - values typed by the student
 * @returns an object with one message per invalid field ({} when valid)
 */
export function validateRegistration(data: RegisterData): FormErrors {
  const errors: FormErrors = {}

  if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!EMAIL_REGEX.test(data.email)) errors.email = 'Enter a valid e-mail address.'
  if (!PHONE_REGEX.test(data.contactNumber)) errors.contactNumber = 'Enter 7 to 15 digits (a leading + is allowed).'
  if (!data.gender) errors.gender = 'Please select a gender.'
  if (data.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (data.confirmPassword !== data.password) errors.confirmPassword = 'Passwords do not match.'

  return errors
}

/**
 * Validates the login form.
 * @param data - e-mail and password typed by the student
 * @returns an error message, or an empty string when valid
 */
export function validateLogin(data: LoginData): string {
  if (!EMAIL_REGEX.test(data.email)) return 'Enter a valid e-mail address.'
  if (!data.password) return 'Password is required.'
  return ''
}
