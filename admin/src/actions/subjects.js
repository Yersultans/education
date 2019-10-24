import axios from "axios";

import { pushMessage } from "./messages";
import displayError from "./errorHelper";

import {
  FETCH_SUBJECTS,
  FETCH_SUBJECT,
  ADD_SUBJECT,
  REMOVE_SUBJECT,
  UPDATE_SUBJECT
} from "./types";

export const fetchSubjects = () => async dispatch => {
  try {
    const res = await axios.get("/api/subjects");
    dispatch({ type: FETCH_SUBJECTS, payload: res.data });
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const fetchSubject = subjectId => async dispatch => {
  try {
    const res = await axios.get(`/api/subjects/${subjectId}`);
    dispatch({ type: FETCH_SUBJECT, payload: res.data });
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const createSubject = subject => async dispatch => {
  try {
    const res = await axios.post("/api/subjects", subject);
    dispatch({ type: ADD_SUBJECT, payload: res.data });
    pushMessage(dispatch, "Successfully created subject");
  } catch (err) {
    displayError(err, dispatch);
  }
};

export const updateSubject = (id, values) => async dispatch => {
  try {
    const res = await axios.post(`/api/subjects/${id}`, values);
    dispatch({ type: UPDATE_SUBJECT, payload: res.data, id });
    pushMessage(dispatch, "Successfully updated subject");
  } catch (err) {
    if (err) {
      displayError(err, dispatch);
    }
  }
};

export const deleteSubject = subjectId => async dispatch => {
  try {
    await axios.delete(`/api/subjects/${subjectId}`);
    dispatch({ type: REMOVE_SUBJECT, payload: subjectId });
    pushMessage(dispatch, "Successfully deleted subject");
  } catch (err) {
    displayError(err, dispatch);
  }
};
