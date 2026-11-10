// App.tsx - decides which page to show: Register, Login or Home (after login).
import { Component } from 'react'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import { isAuthenticated, logout } from './auth/Auth'

type View = 'register' | 'login' | 'home'

interface State {
  view: View
  notice: string // message shown on the Login page
}

export default class App extends Component<object, State> {
  // A student with a valid token goes straight to the home page
  state: State = { view: isAuthenticated() ? 'home' : 'register', notice: '' }

  // After registering, navigate to the Login page
  handleRegistered = () => {
    this.setState({ view: 'login', notice: 'Registration successful. Please log in.' })
  }

  handleLogout = () => {
    logout()
    this.setState({ view: 'login', notice: '' })
  }

  render() {
    const { view, notice } = this.state

    if (view === 'home') return <HomePage onLogout={this.handleLogout} />

    if (view === 'login') {
      return (
        <LoginPage
          notice={notice}
          onLoggedIn={() => this.setState({ view: 'home' })}
          onGoToRegister={() => this.setState({ view: 'register', notice: '' })}
        />
      )
    }

    return (
      <RegisterPage
        onRegistered={this.handleRegistered}
        onGoToLogin={() => this.setState({ view: 'login', notice: '' })}
      />
    )
  }
}
