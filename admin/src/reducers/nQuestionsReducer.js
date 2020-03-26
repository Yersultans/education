import {
  FETCH_NQUESTIONS,
  ADD_NQUESTION,
  REMOVE_NQUESTION
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_NQUESTIONS:
      return action.payload
    case ADD_NQUESTION:
      return [...state, action.payload]
    case REMOVE_NQUESTION:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
