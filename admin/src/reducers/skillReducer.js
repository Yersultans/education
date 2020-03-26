import { FETCH_SKILL } from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_SKILL:
      return { ...state, [action.id]: action.payload }
    default:
      return state
  }
}
