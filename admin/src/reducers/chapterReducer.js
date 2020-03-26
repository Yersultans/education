import {
  FETCH_PROJECT,
  REMOVE_LESSON_IN_CHAPTER,
  UPDATE_LESSON_IN_CHAPTER
} from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_PROJECT: {
      return { ...state, [action.id]: action.payload }
    }
    case UPDATE_LESSON_IN_CHAPTER: {
      const { parentId, chapterId, id, payload } = action
      const newLessons = state[chapterId].lessons.map(lesson => {
        if (parentId && parentId === lesson._id) {
          const newSubLessons = lesson.lessons.map(subLesson =>
            subLesson._id === id ? payload : subLesson
          )
          return { ...lesson, lessons: newSubLessons }
        }
        if (lesson._id === id) return payload
        return lesson
      })
      return {
        ...state,
        [action.chapterId]: { ...state[action.chapterId], lessons: newLessons }
      }
    }
    case REMOVE_LESSON_IN_CHAPTER: {
      const filteredLessons = state[action.id].lessons
        .map(lesson => {
          if (lesson._id === action.payload) {
            return false
          }

          if (lesson.lessons) {
            const filtered = lesson.lessons.filter(
              l => l._id !== action.payload
            )
            const newLesson = { ...lesson, lessons: filtered }
            return newLesson
          }

          return lesson
        })
        .filter(f => f)

      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          lessons: filteredLessons
        }
      }
    }
    default:
      return state
  }
}
