import { combineReducers } from 'redux'
import authReducer from './authReducer'
import categoryReducer from './categoryReducer'
import chapterReducer from './chapterReducer'
import chaptersReducer from './chaptersReducer'
import lessonsReducer from './lessonsReducer'
import messagesReducer from './messagesReducer'
import globalHintsReducer from './globalHintsReducer'
import skillReducer from './skillReducer'
import skillsReducer from './skillsReducer'
import submissionReducer from './submissionReducer'
import submissionsReducer from './submissionsReducer'
import userReducer from './userReducer'
import usersReducer from './usersReducer'
import schoolReducer from './schoolReducer'
import schoolsReducer from './schoolsReducer'
import schoolsListReducer from './schoolsListReducer'
import nCoursesReducer from './nCoursesReducer'
import nCourseReducer from './nCourseReducer'
import nLessonsReducer from './nLessonsReducer'
import nLessonReducer from './nLessonReducer'
import nActivitiesReducer from './nActivitiesReducer'
import nActivityReducer from './nActivityReducer'
import compilersReducer from './compilersReducer'
import nQuestionsReducer from './nQuestionsReducer'
import nQuestionReducer from './nQuestionReducer'

export default combineReducers({
  auth: authReducer,
  categories: categoryReducer,
  chapter: chapterReducer,
  chapters: chaptersReducer,
  compilers: compilersReducer,
  lessons: lessonsReducer,
  messages: messagesReducer,
  globalHints: globalHintsReducer,
  skill: skillReducer,
  skills: skillsReducer,
  submission: submissionReducer,
  submissions: submissionsReducer,
  school: schoolReducer,
  schools: schoolsReducer,
  schoolsList: schoolsListReducer,
  user: userReducer,
  users: usersReducer,
  nCourses: nCoursesReducer,
  nCourse: nCourseReducer,
  nLessons: nLessonsReducer,
  nLesson: nLessonReducer,
  nActivities: nActivitiesReducer,
  nActivity: nActivityReducer,
  nQuestions: nQuestionsReducer,
  nQuestion: nQuestionReducer
})
