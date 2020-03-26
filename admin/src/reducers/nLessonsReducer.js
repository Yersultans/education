import { FETCH_NLESSONS, ADD_NLESSON, REMOVE_NLESSON } from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_NLESSONS:
      return action.payload
    case ADD_NLESSON:
      return [...state, action.payload]
    case REMOVE_NLESSON:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
