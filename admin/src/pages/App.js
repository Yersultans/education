/* eslint-disable react/no-unused-state */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { useLazyQuery, gql, useMutation } from '@apollo/client'
import { Layout, message } from 'antd'
import './App.css'
import Header from '../components/Header'
import Menu from '../components/Menu'
import Login from './auth/Login'
import Register from './auth/Register'

import User from './users/User'
import Users from './users/Users'
import Subject from './subjects/Subject'
import Subjects from './subjects/Subjects'
import Lesson from './lessons/Lesson'
import Lessons from './lessons/Lessons'

import withHelmet from '../hocs/withHelmet'
import AuthContext from '../context/AuthContext'
import MessagesContext from '../context/MessagesContext'
import LocalStorageUtils from '../utils/LocalStorageUtils'
import Questions from './questions/questions'
import AddQuestion from './questions/addQuestion'
import Question from './questions/question'

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

function App() {
  const [messages, setMessages] = useState([])
  const [currentUser, setStateUser] = useState(null)
  const [updateStateUser, setUpdateStateUser] = useState(0)
  const [getCurrentUser, { data, loading, error }] = useLazyQuery(
    GET_CURRENT_USER
  )
  const [sendLogout] = useMutation(LOGOUT)

  const logout = () => {
    LocalStorageUtils.remove('token')
    sendLogout()
    setStateUser(null)
  }

  useEffect(() => {
    getCurrentUser()
  }, [updateStateUser])

  useEffect(() => {
    if (messages.length > 0) {
      if (messages[0].type === 'notify') {
        message.success(messages[0].message, 1)
      } else if (messages[0].type === 'error') {
        message.error(messages[0].message, 2)
      }
      setMessages(messages.slice(1))
    }
  }, [messages])

  useEffect(() => {
    if (!loading && data && data.getCurrentUser) {
      setStateUser(data.getCurrentUser)
    }
  }, [data, loading, error])

  const updateCurrentUser = () => {
    setUpdateStateUser(updateStateUser + 1)
  }

  const displayMessage = message => {
    setMessages([...messages, message])
  }

  const authContext = { currentUser, updateCurrentUser }
  const messagesContext = { displayMessage }
  console.log('environment variables', process.env)

  return (
    <div className="App">
      <AuthContext.Provider value={authContext}>
        <MessagesContext.Provider value={messagesContext}>
          <BrowserRouter>
            <Layout>
              <Header logout={logout} />

              {/* <Menu logout={logout} /> */}
              {currentUser &&
                (currentUser.role === 'admin' ||
                  currentUser.role === 'contentManager') && (
                  <>
                    <Route exact path="/questions" component={Questions} />
                    <Route exact path="/questions/:id" component={Question} />
                    <Route exact path="/addQuestion" component={AddQuestion} />
                    <Route exact path="/subjects" component={Subjects} />
                    <Route exact path="/subjects/:id" component={Subject} />
                    <Route exact path="/lessons" component={Lessons} />
                    <Route exact path="/lessons/:id" component={Lesson} />
                  </>
                )}
              {currentUser && currentUser.role === 'admin' && (
                <>
                  <Route exact path="/users" component={Users} />
                  <Route exact path="/users/:id" component={User} />
                </>
              )}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Layout>
          </BrowserRouter>
        </MessagesContext.Provider>
      </AuthContext.Provider>
    </div>
  )
}

const EnhancedApp = withHelmet([
  { tag: 'title', content: 'Admin | Saturday Kids' }
])(App)

export default EnhancedApp
