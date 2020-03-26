import {
  FETCH_GLOBAL_HINTS,
  FETCH_GLOBAL_HINT,
  ADD_GLOBAL_HINT,
  REMOVE_GLOBAL_HINT,
  UPDATE_GLOBAL_HINT
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_GLOBAL_HINTS: {
      return [...action.payload]
    }
    case FETCH_GLOBAL_HINT: {
      return [...state, action.payload]
    }
    case ADD_GLOBAL_HINT: {
      return [...state, action.payload]
    }
    case REMOVE_GLOBAL_HINT: {
      const newState = state.filter(hint => hint._id !== action.payload)
      return newState
    }
    case UPDATE_GLOBAL_HINT: {
      const newState = state.map(hint => {
        if (hint._id === action.payload._id) {
          return action.payload
        }
        return hint
      })
      return [...newState]
    }
    default:
      return state
  }
}
