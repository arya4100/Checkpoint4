// LoginPage.tsx - student Login UI (React class component).
import { Component } from 'react'
import type { FormEvent } from 'react'
import { loginStudent } from '../api/loginStudent'
import { validateLogin } from '../utils/validators'

interface Props {
  notice?: string // e.g. "Registration successful" shown after registering
  onLoggedIn: () => void
  onGoToRegister: () => void
}

interface State {
  email: string
  password: string
  error: string
  loading: boolean
}

export default class LoginPage extends Component<Props, State> {
  state: State = { email: '', password: '', error: '', loading: false }

  // Validate, call the server, store the JWT, then open the home page
  handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { email, password } = this.state

    const validationError = validateLogin({ email, password })
    if (validationError) {
      this.setState({ error: validationError })
      return
    }

    this.setState({ loading: true, error: '' })
    try {
      await loginStudent({ email, password })
      this.props.onLoggedIn()
    } catch (err) {
      this.setState({ error: (err as Error).message, loading: false })
    }
  }

  render() {
    const { email, password, error, loading } = this.state
    return (
      <main className="card">
        <h1>Student Login</h1>

        {this.props.notice && <p className="alert alert-success">{this.props.notice}</p>}

        <form onSubmit={this.handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Mail Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </div>

          {error && <p className="alert alert-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="switch">
          New student?{' '}
          <button type="button" className="link" onClick={this.props.onGoToRegister}>
            Register
          </button>
        </p>
      </main>
    )
  }
}
