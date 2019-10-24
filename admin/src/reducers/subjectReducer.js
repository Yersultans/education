import { FETCH_SUBJECT, UPDATE_SUBJECT } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SUBJECT:
      return { ...state, [action.payload._id]: action.payload };
    case UPDATE_SUBJECT:
      return { ...state, [action.payload._id]: action.payload };
    default:
      return state;
  }
}