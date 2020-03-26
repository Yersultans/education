import {
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORY,
  UPDATE_CATEGORY
} from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return action.payload
    case FETCH_CATEGORY:
    case ADD_CATEGORY:
      return [...state, action.payload]
    case UPDATE_CATEGORY: {
      const newState = state.map(cat => {
        if (cat._id === action.payload._id) {
          return action.payload
        }
        return cat
      })
      return [...newState]
    }
    case REMOVE_CATEGORY:
      return state.filter(item => item._id !== action.payload)
    default:
      return state
  }
}
