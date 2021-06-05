import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function PrivateRoute({ component: Component, ...rest }) {
  const { checkUserIsLoggedIn } = useAuth()

  return (
    <Route
      {...rest}
      render={props =>
        checkUserIsLoggedIn() ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired
}

export default PrivateRoute
