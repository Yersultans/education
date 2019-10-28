import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import usersReducer from "./usersReducer";
import subjectReducer from "./subjectReducer";
import subjectsReducer from "./subjectsReducer";
import messagesReducer from "./messagesReducer";
import lessonReducer from "./lessonReducer";
import lessonsReducer from "./lessonsReducer";

export default combineReducers({
  auth: authReducer,
  users: usersReducer,
  user: userReducer,
  subjects: subjectsReducer,
  subject: subjectReducer,
  lessons: lessonsReducer,
  lesson: lessonReducer,
  messages: messagesReducer
});