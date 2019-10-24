import { FETCH_SUBJECTS, ADD_SUBJECT, REMOVE_SUBJECT } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_SUBJECTS:
      return action.payload;
    case ADD_SUBJECT:
      return [...state, action.payload];
    case REMOVE_SUBJECT:
      return state.filter(item => item._id !== action.payload);
    default:
      return state;
  }
}
