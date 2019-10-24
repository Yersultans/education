import axios from "axios";

import { pushMessage } from "./messages";
import displayError from "./errorHelper";

import {
  FETCH_LESSONS,
  FETCH_LESSON,
  ADD_LESSON,
  REMOVE_LESSON,
  UPDATE_LESSON
} from "./types";

export const fetchLessons = () => async dispatch => {
  try {
    const res = await axios.get("/api/lessons");
    dispatch({ type: FETCH_LESSONS, payload: res.data });
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const fetchLesson = lessonId => async dispatch => {
  try {
    const res = await axios.get(`/api/lessons/${lessonId}`);
    dispatch({ type: FETCH_LESSON, payload: res.data });
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const createLesson = lesson => async dispatch => {
  try {
    const res = await axios.post("/api/lessons", lesson);
    dispatch({ type: ADD_LESSON, payload: res.data });
    pushMessage(dispatch, "Successfully created lesson");
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const updateLesson = (id, values) => async dispatch => {
  try {
    const res = await axios.post(`/api/lessons/${id}`, values);
    dispatch({ type: UPDATE_LESSON, payload: res.data, id });
    pushMessage(dispatch, "Successfully updated lesson");
  } catch (err) {
    if (err) {
      displayError(err, dispatch);
    }
  }
};

export const deleteLesson = lessonId => async dispatch => {
  try {
    await axios.delete(`/api/lessons/${lessonId}`);
    dispatch({ type: REMOVE_LESSON, payload: lessonId });
    pushMessage(dispatch, "Successfully deleted lesson");
  } catch (err) {
    displayError(err, dispatch);
  }
};
