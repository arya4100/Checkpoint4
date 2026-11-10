// RegisterPage.tsx - student Registration UI (React class component).
import { Component } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { registerStudent } from '../api/registerStudent'
import { validateRegistration } from '../utils/validators'
import type { FormErrors, RegisterData } from '../types'

interface Props {
  onRegistered: () => void // called after a successful registration (goes to Login)
  onGoToLogin: () => void
}

interface State {
  form: RegisterData
  errors: FormErrors
  serverError: string
  loading: boolean
}

const EMPTY_FORM: RegisterData = {
  name: '',
  email: '',
  contactNumber: '',
  gender: '',
  password: '',
  confirmPassword: '',
}

export default class RegisterPage extends Component<Props, State> {
  state: State = { form: { ...EMPTY_FORM }, errors: {}, serverError: '', loading: false }

  // Update the form value that matches the input's name attribute
  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = e.target.name as keyof RegisterData
    const value = e.target.value
    this.setState((prev) => ({ form: { ...prev.form, [field]: value } }))
  }

  // Validate, send to the server, then move to the Login page
  handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const errors = validateRegistration(this.state.form)
    this.setState({ errors, serverError: '' })
    if (Object.keys(errors).length > 0) return // stop if any field is invalid

    this.setState({ loading: true })
    try {
      await registerStudent(this.state.form)
      this.props.onRegistered()
    } catch (err) {
      this.setState({ serverError: (err as Error).message })
    } finally {
      this.setState({ loading: false })
    }
  }

  // Small helper so each field is written only once
  renderInput(label: string, name: keyof RegisterData, type = 'text') {
    const { form, errors } = this.state
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <input id={name} name={name} type={type} value={form[name]} onChange={this.handleChange} />
        {errors[name] && <span className="error">{errors[name]}</span>}
      </div>
    )
  }

  render() {
    const { form, errors, serverError, loading } = this.state
    return (
      <main className="card">
        <h1>Student Registration</h1>
        <form onSubmit={this.handleSubmit} noValidate>
          {this.renderInput('Name', 'name')}
          {this.renderInput('Mail Address', 'email', 'email')}
          {this.renderInput('Contact Number', 'contactNumber', 'tel')}

          <div className="field">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={form.gender} onChange={this.handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          {this.renderInput('Password', 'password', 'password')}
          {this.renderInput('Confirm Password', 'confirmPassword', 'password')}

          {serverError && <p className="alert alert-error">{serverError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="switch">
          Already registered?{' '}
          <button type="button" className="link" onClick={this.props.onGoToLogin}>
            Log in
          </button>
        </p>
      </main>
    )
  }
}
