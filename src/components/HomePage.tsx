// HomePage.tsx - protected page, only shown to a logged in student.
import { Component } from 'react'
import { getProfile } from '../api/getProfile'
import { ApiError } from '../api/apiClient'
import type { Profile } from '../types'

interface Props {
  onLogout: () => void
}

interface State {
  profile: Profile | null
  error: string
}

export default class HomePage extends Component<Props, State> {
  state: State = { profile: null, error: '' }

  // Ask the server for the profile using the saved JWT
  async componentDidMount() {
    try {
      this.setState({ profile: await getProfile() })
    } catch (err) {
      this.setState({ error: (err as Error).message })

      // Log out only when the server rejects the token (401/403).
      // A network error (e.g. offline) keeps the student signed in.
      const status = err instanceof ApiError ? err.status : 0
      if (status === 401 || status === 403) this.props.onLogout()
    }
  }

  render() {
    const { profile, error } = this.state
    return (
      <main className="card">
        <h1>Welcome{profile ? `, ${profile.name}` : ''}</h1>
        {error && <p className="alert alert-error">{error}</p>}

        {profile ? (
          <dl className="profile">
            <dt>Mail Address</dt>
            <dd>{profile.email}</dd>
            <dt>Contact Number</dt>
            <dd>{profile.contactNumber}</dd>
            <dt>Gender</dt>
            <dd>{profile.gender}</dd>
          </dl>
        ) : (
          !error && <p>Loading your profile...</p>
        )}

        <button type="button" onClick={this.props.onLogout}>
          Logout
        </button>
      </main>
    )
  }
}
