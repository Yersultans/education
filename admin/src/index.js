import 'react-app-polyfill/ie9' // For IE 9-11 support
import 'react-app-polyfill/ie11' // For IE 11 support

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import axios from 'axios'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  concat
} from '@apollo/client'

import LocalStorageUtils from './utils/LocalStorageUtils'
import './index.css'
import App from './pages/App'
import registerServiceWorker from './registerServiceWorker'
import reducers from './reducers'

// Development only axios helpers
window.axios = axios

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
)

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:5001/graphql'
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: LocalStorageUtils.get('token')
        ? `Bearer ${LocalStorageUtils.get('token')}`
        : null
    }
  })

  return forward(operation)
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

console.log('environment variables', process.env)

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
