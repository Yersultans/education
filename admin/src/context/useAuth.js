import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation, useQuery } from '@apollo/client'

const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      username
      role
    }
  }
`

const LOGOUT = gql`
  mutation logout {
    logout {
      message
    }
  }
`

const authContext = React.createContext()

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = React.useState(null)
  const [sendLogout] = useMutation(LOGOUT)

  const {
    data,
    loading,
    error,
    refetch,
    networkStatus
  } = useQuery(GET_CURRENT_USER, { notifyOnNetworkStatusChange: true })

  React.useEffect(() => {
    if (!loading && data && data.getCurrentUser) {
      setUser(data.getCurrentUser)
    }
  }, [data, loading, error, networkStatus])

  function fetchUser() {
    refetch()
  }

  function logout() {
    sendLogout()
    localStorage.removeItem('token')
    setUser(null)
  }

  function checkUserIsLoggedIn() {
    return localStorage.getItem('token') !== null
  }

  // Return the user object and auth methods
  return {
    user,
    checkUserIsLoggedIn,
    fetchUser,
    logout
  }
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return React.useContext(authContext)
}

ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired
}
