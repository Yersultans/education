import { FETCH_NLESSON, UPDATE_NLESSON } from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_NLESSON:
      return { ...state, [action.id]: action.payload }
    case UPDATE_NLESSON:
      return { ...state, [action.id]: action.payload }
    default:
      return state
  }
}
