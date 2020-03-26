import { FETCH_NQUESTION, UPDATE_NQUESTION } from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_NQUESTION:
      return { ...state, [action.id]: action.payload }
    case UPDATE_NQUESTION:
      return { ...state, [action.id]: action.payload }
    default:
      return state
  }
}
