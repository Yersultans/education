import { combineReducers } from 'redux'
import userReducer from './userReducer'
import usersReducer from './usersReducer'

export default combineReducers({
  user: userReducer,
  users: usersReducer
})
