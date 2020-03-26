import axios from 'axios'

import { pushError, pushMessage } from './messages'

import {
  FETCH_PROJECTS,
  FETCH_PROJECT,
  ADD_PROJECT,
  REMOVE_PROJECT
} from './types'

export const fetchChapters = async dispatch => {
  try {
    const res = await axios.get('/api/projects')
    dispatch({ type: FETCH_PROJECTS, payload: res.data })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const fetchChapter = async (id, dispatch) => {
  try {
    const res = await axios.get(`/api/projects/${id}`)
    dispatch({ type: FETCH_PROJECT, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const copyChapter = async (id, dispatch) => {
  try {
    const res = await axios.post(`/api/copychapter/${id}`)
    dispatch({ type: ADD_PROJECT, payload: res.data })
    pushMessage(dispatch, 'Successfully copied project')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const updateChapter = async (id, values, dispatch) => {
  try {
    const res = await axios.post(`/api/projects/${id}`, values)
    dispatch({ type: FETCH_PROJECT, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated project')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteChapter = async (chapterId, dispatch) => {
  try {
    const res = await axios.delete(`/api/projects/${chapterId}`)
    pushMessage(dispatch, 'Successfully deleted project')
    dispatch({ type: REMOVE_PROJECT, payload: chapterId })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}

export const createChapter = async (chapter, dispatch) => {
  await axios
    .post('/api/projects', chapter)
    .then(res => {
      dispatch({ type: ADD_PROJECT, payload: res.data })
      pushMessage(dispatch, 'Successfully created project')
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
