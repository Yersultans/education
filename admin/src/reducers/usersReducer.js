import {
  FETCH_USERS,
  FETCH_SCHOOL_ADMINS
  // ADD_USER,
  // REMOVE_USER
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, ...action.payload }
    case FETCH_SCHOOL_ADMINS:
      return { ...state, schoolAdmins: action.payload }
    // REMOVED BECAUSE OF PAGINATION
    // case ADD_USER:
    //   return [...state, action.payload];
    // case REMOVE_USER:
    //   return state.filter(item => item._id !== action.payload);
    default:
      return state
  }
}
