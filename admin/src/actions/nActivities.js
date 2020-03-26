import axios from 'axios'

import { pushMessage, pushError } from './messages'

import {
  FETCH_NACTIVITIES,
  FETCH_NACTIVITY,
  ADD_NACTIVITY,
  UPDATE_NACTIVITY,
  REMOVE_NACTIVITY
} from './types'

export const fetchNActivities = () => async dispatch => {
  try {
    const res = await axios.get(`/api/nActivities`)
    dispatch({ type: FETCH_NACTIVITIES, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchNActivity = id => async dispatch => {
  try {
    const res = await axios.get(`/api/nActivity/${id}`)
    dispatch({ type: FETCH_NACTIVITY, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const createNActivity = nLesson => async dispatch => {
  await axios
    .post('/api/nActivity', nLesson)
    .then(res => {
      dispatch({ type: ADD_NACTIVITY, payload: res.data })
      pushMessage(dispatch, 'Successfully created NActivity')
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

export const updateNActivity = (id, values) => async dispatch => {
  try {
    const res = await axios.put(`/api/nActivity/${id}`, values)
    dispatch({ type: UPDATE_NACTIVITY, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated NActivity')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteNActivity = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/nActivity/${id}`)
    pushMessage(dispatch, 'Successfully deleted NActivity')
    dispatch({ type: REMOVE_NACTIVITY, payload: id })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}
