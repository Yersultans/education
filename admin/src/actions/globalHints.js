import axios from 'axios'

import { pushError, pushMessage } from './messages'

import {
  FETCH_GLOBAL_HINTS,
  FETCH_GLOBAL_HINT,
  ADD_GLOBAL_HINT,
  REMOVE_GLOBAL_HINT,
  UPDATE_GLOBAL_HINT
} from './types'

export const fetchHints = async dispatch => {
  try {
    const res = await axios.get('/api/global/hints')
    dispatch({ type: FETCH_GLOBAL_HINTS, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchHint = async (id, dispatch) => {
  try {
    const res = await axios.get(`/api/global/hint/${id}`)
    dispatch({ type: FETCH_GLOBAL_HINT, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const updateHint = async ({ id, ...params }, dispatch) => {
  try {
    /* eslint-disable-next-line */
    const res = await axios.put(`/api/global/hint/${id}`, params)
    dispatch({
      type: UPDATE_GLOBAL_HINT,
      payload: res.data
    })
    pushMessage(dispatch, 'Successfully updated hint')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteHint = async (params, dispatch) => {
  try {
    const { id } = params
    await axios.delete(`/api/global/hint/${id}`)
    dispatch({
      type: REMOVE_GLOBAL_HINT,
      payload: id
    })
    return pushMessage(dispatch, 'Successfully deleted hint')
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}

export const createHint = async (params, dispatch) => {
  await axios
    .post('/api/global/hint', params)
    .then(res => {
      dispatch({
        type: ADD_GLOBAL_HINT,
        payload: res.data
      })
      pushMessage(dispatch, 'Successfully created hint')
    })
    .catch(error => {
      if (error.response) {
        if (error.response.data) {
          error.response.data.map(errMessage =>
            pushError(dispatch, errMessage.msg)
          )
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
    })
}
