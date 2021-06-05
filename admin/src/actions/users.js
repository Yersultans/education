import axios from 'axios'

import { pushMessage, pushError } from './messages'
import displayError from './errorHelper'
import randomInRange from '../utils'

import {
  FETCH_USERS,
  FETCH_USER,
  FETCH_SCHOOL_ADMINS
  // ADD_USER,
  // REMOVE_USER,
} from './types'

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    const token = localStorage.get('token')
    const headers = {
      Authorization: `Bearer ${token}`,
      ...config.headers
    }

    const newConfig = { ...config, headers }
    return newConfig
  },
  error =>
    // Do something with request error
    Promise.reject(error)
)

export const fetchUsers = ({
  populateSchool = false,
  page,
  userName,
  name,
  schoolId
}) => async dispatch => {
  try {
    const res = await axios.get(`/api/users`, {
      params: { populateSchool, page: page || 1, userName, name, schoolId }
    })
    if (populateSchool) {
      res.data.docs = res.data.docs.map(s => ({
        ...s,
        // eslint-disable-next-line no-nested-ternary
        schoolName: s.school ? (s.school.name ? s.school.name : '') : ''
      }))
    }
    dispatch({ type: FETCH_USERS, payload: res.data })
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const fetchUser = id => async dispatch => {
  try {
    const res = await axios.get(`/api/users/${id}`)
    dispatch({ type: FETCH_USER, payload: res.data, id })
  } catch (err) {
    displayError(err, dispatch)
  }
}

// eslint-disable-next-line consistent-return
export const createUser = user => async dispatch => {
  try {
    const res = await axios.post('/api/users', {
      ...user,
      avatar: {
        body: randomInRange(1, 6),
        color: randomInRange(1, 6),
        eyes: randomInRange(1, 6),
        mouth: randomInRange(1, 6)
      }
    })

    pushMessage(dispatch, 'Successfully USER Registrated!')
    return res.data
  } catch (error) {
    /* eslint-disable-next-line */
    console.log(user.email, user.name, ' — ', error)
    // displayError(error, dispatch);
    if (error.response) {
      if (error.response.data && Array.isArray(error.response.data)) {
        error.response.data.map(errMessage =>
          pushError(dispatch, errMessage.msg)
        )
      } else {
        pushError(dispatch, error.response.data.message)
      }
    } else if (error.request) {
      /* eslint-disable-next-line */
      console.log(error.request)
    } else {
      /* eslint-disable-next-line */
      console.log('Error', error.message)
    }
    /* eslint-disable-next-line */
    console.log(error.config)
  }
}

export const updateUser = (id, values) => async dispatch => {
  try {
    const res = await axios.post(`/api/users/${id}`, values)
    dispatch({ type: FETCH_USER, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated user')
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const updateUserPassword = (id, password) => async dispatch => {
  try {
    const res = await axios.post(`/api/users/${id}/setPassword`, { password })
    dispatch({ type: FETCH_USER, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated user password')
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const deleteUser = userId => async dispatch => {
  try {
    await axios.delete(`/api/users/${userId}`)
    // dispatch({ type: REMOVE_USER, payload: userId });
    pushMessage(dispatch, 'Successfully deleted user')
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const giveUserSocialBadge = (socialType, userId) => async dispatch => {
  const res = await axios.post(`/api/badge/social_achievements`, {
    socialType,
    userId
  })
  pushMessage(dispatch, `Successfully bestowed user a ${socialType} badge `)
  /* eslint-disable-next-line */
  console.log('res.data', res.data)
}

export const fetchSchoolAdmins = () => async dispatch => {
  try {
    const res = await axios.get(`/api/schoolAdmins`)
    dispatch({ type: FETCH_SCHOOL_ADMINS, payload: res.data })
  } catch (err) {
    displayError(err, dispatch)
  }
}
