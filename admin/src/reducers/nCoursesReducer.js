import { FETCH_NCOURSES, ADD_NCOURSE, REMOVE_NCOURSE } from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_NCOURSES:
      return action.payload
    case ADD_NCOURSE:
      return [...state, action.payload]
    case REMOVE_NCOURSE:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
