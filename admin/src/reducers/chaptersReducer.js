import { FETCH_PROJECTS, ADD_PROJECT, REMOVE_PROJECT } from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_PROJECTS:
      return action.payload
    case ADD_PROJECT:
      return [...state, action.payload]
    case REMOVE_PROJECT:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
