import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter, Route } from 'react-router-dom'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  concat
} from '@apollo/client'
import { ToastContainer } from 'react-toastify'

import './App.css'
import Login from './auth/Login'
// import User from './users/User'
// import Users from './users/Users'
import Subject from './subjects/Subject'
import Subjects from './subjects/Subjects'
import Posts from './post/Posts'
import Post from './post/Post'
import Questions from './questions/questions'
import AddQuestion from './questions/addQuestion'
import Question from './questions/question'
import PublicPage from './PublicPage'

import withHelmet from '../hocs/withHelmet'
import { ProvideAuth } from '../context/useAuth'
import { ProvideLoading } from '../context/useLoading'
import LoadingDialog from '../context/LoadingDialog'
import PrivateRoute from '../hocs/PrivateRoute'

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('token')
        ? `Bearer ${localStorage.getItem('token')}`
        : null
    }
  })

  return forward(operation)
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ProvideAuth>
        <ProvideLoading>
          <BrowserRouter>
            <ToastContainer />
            <LoadingDialog />
            <Route exact path="/public" component={PublicPage} />
            <Route exact path="/" component={PublicPage} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/subjects" component={Subjects} />
            <PrivateRoute exact path="/subjects/:id" component={Subject} />
            <PrivateRoute exact path="/questions" component={Questions} />
            <PrivateRoute exact path="/questions/:id" component={Question} />
            <PrivateRoute exact path="/addQuestion" component={AddQuestion} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/posts/:id" component={Post} />
          </BrowserRouter>
        </ProvideLoading>
      </ProvideAuth>
    </ApolloProvider>
  )
}

const EnhancedApp = withHelmet([{ tag: 'title', content: 'Admin | ProENT' }])(
  App
)

export default EnhancedApp
