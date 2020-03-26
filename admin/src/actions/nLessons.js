import axios from 'axios'

import { pushMessage, pushError } from './messages'

import {
  FETCH_NLESSONS,
  FETCH_NLESSON,
  ADD_NLESSON,
  UPDATE_NLESSON,
  REMOVE_NLESSON
} from './types'

export const fetchNLessons = () => async dispatch => {
  try {
    const res = await axios.get(`/api/nlessons`)
    dispatch({ type: FETCH_NLESSONS, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchNLesson = id => async dispatch => {
  try {
    const res = await axios.get(`/api/nLesson/${id}`)
    dispatch({ type: FETCH_NLESSON, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const createNLesson = nLesson => async dispatch => {
  await axios
    .post('/api/NLesson', nLesson)
    .then(res => {
      dispatch({ type: ADD_NLESSON, payload: res.data })
      pushMessage(dispatch, 'Successfully created NLesson')
    })
    .catch(error => {
      if (error.response) {
        if (error.response.data) {
          error.response.data.map(errMessage => {
            pushError(dispatch, errMessage.msg)
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

export const updateNLesson = (id, values) => async dispatch => {
  try {
    const res = await axios.put(`/api/nLesson/${id}`, values)
    dispatch({ type: UPDATE_NLESSON, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated NLesson')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteNLesson = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/nLesson/${id}`)
    pushMessage(dispatch, 'Successfully deleted NLesson')
    dispatch({ type: REMOVE_NLESSON, payload: id })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}
