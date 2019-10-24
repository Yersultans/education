import { FETCH_LESSONS, ADD_LESSON, REMOVE_LESSON } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_LESSONS:
      return action.payload;
    case ADD_LESSON:
      return [...state, action.payload];
    case REMOVE_LESSON:
      return state.filter(item => item._id !== action.payload);
    default:
      return state;
  }
}
