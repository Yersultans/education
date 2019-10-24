import { FETCH_LESSON, UPDATE_LESSON } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_LESSON:
      return { ...state, [action.payload._id]: action.payload };
    case UPDATE_LESSON:
      return { ...state, [action.payload._id]: action.payload };
    default:
      return state;
  }
}