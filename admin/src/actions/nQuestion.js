import axios from 'axios'

import { pushMessage, pushError } from './messages'

import {
  FETCH_NQUESTIONS,
  FETCH_NQUESTION,
  ADD_NQUESTION,
  UPDATE_NQUESTION,
  REMOVE_NQUESTION
} from './types'

export const fetchNQuestions = () => async dispatch => {
  try {
    const res = await axios.get(`/api/nQuestions`)
    dispatch({ type: FETCH_NQUESTIONS, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchNQuestion = id => async dispatch => {
  try {
    const res = await axios.get(`/api/nQuestion/${id}`)
    dispatch({ type: FETCH_NQUESTION, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const createNQuestion = nLesson => async dispatch => {
  await axios
    .post('/api/nQuestion', nLesson)
    .then(res => {
      dispatch({ type: ADD_NQUESTION, payload: res.data })
      pushMessage(dispatch, 'Successfully created NQuestion')
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

export const updateNQuestion = (id, values) => async dispatch => {
  try {
    const res = await axios.put(`/api/nQuestion/${id}`, values)
    dispatch({ type: UPDATE_NQUESTION, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated NQuestion')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteNQuestion = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/nQuestion/${id}`)
    pushMessage(dispatch, 'Successfully deleted NQuestion')
    dispatch({ type: REMOVE_NQUESTION, payload: id })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}
