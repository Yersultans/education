import { FETCH_NCOURSE, UPDATE_NCOURSE } from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_NCOURSE:
      return { ...state, [action.id]: action.payload }
    case UPDATE_NCOURSE:
      return { ...state, [action.id]: action.payload }
    default:
      return state
  }
}
