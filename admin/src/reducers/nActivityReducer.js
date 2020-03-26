import { FETCH_NACTIVITY, UPDATE_NACTIVITY } from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_NACTIVITY:
      return { ...state, [action.id]: action.payload }
    case UPDATE_NACTIVITY:
      return { ...state, [action.id]: action.payload }
    default:
      return state
  }
}
