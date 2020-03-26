import axios from 'axios'

import { pushError, pushMessage } from './messages'

import { FETCH_PROJECT } from './types'

export const fetchStep = async (id, dispatch) => {
  try {
    const res = await axios.get(`/api/step/${id}`)
    dispatch({ type: FETCH_PROJECT, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const updateStep = async (params, dispatch) => {
  try {
    /* eslint-disable-next-line */
    console.log('params', params)
    const { chapterId, id, ...data } = params
    const res = await axios.put(`/api/step/${id}`, { chapterId, data })
    dispatch({
      type: FETCH_PROJECT,
      id: chapterId,
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

export const deleteStep = async (params, dispatch) => {
  try {
    const { id, lessonId, chapterId } = params
    const res = await axios.delete(`/api/step/${id}/${lessonId}/${chapterId}`)
    dispatch({
      type: FETCH_PROJECT,
      id: chapterId,
      payload: res.data
    })
    return pushMessage(dispatch, 'Successfully deleted hint')
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}

export const createStep = async (params, dispatch) => {
  await axios
    .post('/api/step', params)
    .then(res => {
      dispatch({
        type: FETCH_PROJECT,
        id: params.chapterId,
        payload: res.data
      })
      pushMessage(dispatch, 'Successfully created step')
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
