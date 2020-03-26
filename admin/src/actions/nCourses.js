import axios from 'axios'

import { pushMessage, pushError } from './messages'

import {
  FETCH_NCOURSES,
  FETCH_NCOURSE,
  ADD_NCOURSE,
  UPDATE_NCOURSE,
  REMOVE_NCOURSE
} from './types'

export const fetchNCourses = () => async dispatch => {
  try {
    const res = await axios.get(`/api/nCourses`)
    dispatch({
      type: FETCH_NCOURSES,
      payload: res.data
    })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchNCourse = id => async dispatch => {
  try {
    const res = await axios.get(`/api/nCourse/${id}`)
    dispatch({
      type: FETCH_NCOURSE,
      payload: res.data,
      id
    })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const createNCourse = (nCourse, displayMessage) => async dispatch => {
  console.log('sending ncourse from actions')

  await axios
    .post('/api/nCourseNested', nCourse)
    .then(res => {
      dispatch({
        type: ADD_NCOURSE,
        payload: res.data
      })
      displayMessage({
        type: 'notify',
        message: 'Successfully created NCourse'
      })
      pushMessage(dispatch, 'Successfully created NCourse')
    })
    .catch(error => {
      if (error.response) {
        if (error.response.data) {
          error.response.data.map(errMessage => {
            pushError(dispatch, errMessage.msg)
            displayMessage({
              type: 'error',
              message: errMessage.msg
            })
            return null
          })
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
}

export const updateNCourse = (id, values) => async dispatch => {
  try {
    const res = await axios.put(`/api/nCourse/${id}`, values)
    dispatch({
      type: UPDATE_NCOURSE,
      payload: res.data,
      id
    })
    pushMessage(dispatch, 'Successfully updated NCourse')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteNCourse = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/nCourse/${id}`)
    pushMessage(dispatch, 'Successfully deleted NCourse')
    dispatch({
      type: REMOVE_NCOURSE,
      payload: id
    })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}
