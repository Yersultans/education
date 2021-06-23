import React from 'react'
import { Redirect } from 'react-router-dom'

const PublicPage = () => {
  return <Redirect to={{ pathname: '/login' }} />
}

export default PublicPage
