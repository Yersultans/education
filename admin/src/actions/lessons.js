import axios from 'axios'

import { pushMessage, pushError } from './messages'
import displayError from './errorHelper'

import {
  FETCH_LESSONS,
  FETCH_PROJECT,
  UPDATE_LESSON_IN_CHAPTER,
  REMOVE_LESSON_IN_CHAPTER
} from './types'

export const fetchLessons = async (lessonIds, dispatch) => {
  try {
    const res = await axios.get('/api/lessons', { lessonIds })
    dispatch({ type: FETCH_LESSONS, payload: res.data })
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const fetchLesson = async (id, chapterId, dispatch) => {
  try {
    const res = await axios.get(`/api/lesson/${id}`)
    dispatch({
      type: UPDATE_LESSON_IN_CHAPTER,
      chapterId,
      lessonId: id,
      payload: res.data
    })
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const createLesson = async (newLesson, dispatch) => {
  try {
    const res = await axios.post('/api/lesson', newLesson)
    dispatch({ type: FETCH_PROJECT, id: res.data._id, payload: res.data })
    pushMessage(dispatch, 'Successfully created lesson')
  } catch (error) {
    if (error.response) {
      if (error.response.data) {
        error.response.data.map(errMessage => {
          pushError(dispatch, errMessage.msg)
          return null
        })
      }
    } else if (error.request) {
      // eslint-disable-next-line
      console.log('Error.request'.error.request)
    } else {
      // eslint-disable-next-line
      console.log('Error', error.message)
    }
    // eslint-disable-next-line
    console.log(error.config)
  }
}

export const updateLesson = async (
  id,
  chapterId,
  values,
  parentId,
  dispatch
) => {
  try {
    const res = await axios.post(`/api/lesson/${id}`, values)
    dispatch({
      type: UPDATE_LESSON_IN_CHAPTER,
      chapterId,
      payload: res.data,
      id,
      parentId
    })
    pushMessage(dispatch, 'Successfully updated lesson')
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const updateLessonGroup = async (id, chapterId, params, dispatch) => {
  try {
    const res = await axios.post(`/api/lessonGroup/${id}`, {
      chapterId,
      params
    })
    dispatch({
      type: FETCH_PROJECT,
      id: chapterId,
      payload: res.data
    })
    pushMessage(dispatch, 'Successfully updated lesson')
  } catch (err) {
    displayError(err, dispatch)
  }
}

export const deleteLesson = async (
  lessonId,
  chapterId,
  parentLessonId,
  dispatch
) => {
  try {
    await axios.delete(
      `/api/lessons?lessonId=${lessonId}&chapterId=${chapterId}&parentLessonId=${parentLessonId}`
    )
    dispatch({
      type: REMOVE_LESSON_IN_CHAPTER,
      id: chapterId,
      payload: lessonId
    })
    pushMessage(dispatch, 'Successfully deleted lesson')
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('err', err)
    displayError(err, dispatch)
  }
}

export const copyLesson = async (
  lessonId,
  chapterId,
  parentLessonId,
  dispatch
) => {
  try {
    const res = await axios.post(`/api/lessonCopy/${lessonId}`, {
      chapterId,
      parentLessonId
    })
    dispatch({
      type: FETCH_PROJECT,
      id: chapterId,
      payload: res.data
    })
    pushMessage(dispatch, 'Successfully copied lesson')
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('err', err)
    displayError(err, dispatch)
  }
}
