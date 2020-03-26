import axios from 'axios'

import { pushError, pushMessage } from './messages'

import { FETCH_PROJECT } from '../actions/types'

export const updateHint = async ({ id, ...params }, dispatch) => {
  try {
    /* eslint-disable-next-line */
    const res = await axios.put(`/api/hint/${id}`, params)
    dispatch({
      type: FETCH_PROJECT,
      id: params.chapterId,
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
    const { id, chapterId, isTask, deletingId } = params
    const res = await axios.delete(
      `/api/hint/${id}/${chapterId}/${isTask}/${deletingId}`
    )
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

export const createHint = async (params, dispatch) => {
  await axios
    .post('/api/hint', params)
    .then(res => {
      dispatch({
        type: FETCH_PROJECT,
        id: params.chapterId,
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
