import {
  FETCH_LESSONS,
  FETCH_LESSON,
  ADD_LESSON,
  REMOVE_LESSON,
  UPDATE_LESSON
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_LESSONS:
      return action.payload
    case FETCH_LESSON:
      return [...state, action.payload]
    case UPDATE_LESSON:
      return [...state]
    case ADD_LESSON:
      return [...state, action.payload]
    case REMOVE_LESSON:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
