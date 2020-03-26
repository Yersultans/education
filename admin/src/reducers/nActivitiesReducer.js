import {
  FETCH_NACTIVITIES,
  ADD_NACTIVITY,
  REMOVE_NACTIVITY
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_NACTIVITIES:
      return action.payload
    case ADD_NACTIVITY:
      return [...state, action.payload]
    case REMOVE_NACTIVITY:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
