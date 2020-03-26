import axios from 'axios'

import { pushError, pushMessage } from './messages'

import {
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORY,
  UPDATE_CATEGORY
} from './types'

export const fetchCategories = async dispatch => {
  try {
    const res = await axios.get('/api/categories')
    return dispatch({ type: FETCH_CATEGORIES, payload: res.data })
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}

export const fetchCategory = async (id, dispatch) => {
  try {
    const res = await axios.get(`/api/category/${id}`)
    dispatch({ type: FETCH_CATEGORY, payload: res.data, id })
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const updateCategory = async (id, values, dispatch) => {
  try {
    /* eslint-disable-next-line */
    const res = await axios.put(`/api/category/${id}`, values)
    dispatch({ type: UPDATE_CATEGORY, payload: res.data, id })
    pushMessage(dispatch, 'Successfully updated category')
  } catch (err) {
    if (err.response) {
      pushError(dispatch, err.response.data)
    } else {
      pushError(dispatch, 'Unspecified error')
    }
  }
}

export const deleteCategory = async (categoryId, dispatch) => {
  try {
    const res = await axios.delete(`/api/category/${categoryId}`)
    pushMessage(dispatch, 'Successfully deleted category')
    dispatch({ type: REMOVE_CATEGORY, payload: categoryId })
    return res
  } catch (err) {
    if (err.response) {
      return pushError(dispatch, err.response.data)
    }
    return pushError(dispatch, 'Unspecified error')
  }
}

export const createCategory = async (category, dispatch) => {
  await axios
    .post('/api/category', category)
    .then(res => {
      dispatch({ type: ADD_CATEGORY, payload: res.data })
      pushMessage(dispatch, 'Successfully created category')
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
