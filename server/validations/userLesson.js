const { body } = require('express-validator/check')

const validateCreationBody = () => [
  body('lessonId', 'lessonId is required')
    .exists()
    .trim(),
  body('lessonId', 'lessonId should be String').custom(value => {
    if (value) {
      return typeof value === 'string'
    }
    return true
  }),
  body('userId', 'userId is required')
    .exists()
    .trim(),
  body('userId', 'userId should be String').custom(value => {
    if (value) {
      return typeof value === 'string'
    }
    return true
  })
]

const validateByUserId = () => [
  body('userId', 'userId is required')
    .exists()
    .trim(),
  body('userId', 'userId should be String').custom(value => {
    if (value) {
      return typeof value === 'string'
    }
    return true
  })
]

const validateByLessonId = () => [
  body('lessonId', 'lessonId is required')
    .exists()
    .trim(),
  body('lessonId', 'lessonId should be String').custom(value => {
    if (value) {
      return typeof value === 'string'
    }
    return true
  })
]

const validateHints = () => [
  body('userHints', 'userHints is required')
    .exists()
    .trim(),
  body('userHints', 'userHints should be String').custom(value => {
    if (!value) return false

    if (Array.isArray(value)) {
      const isIdsValid = value.find(v => typeof v !== 'string')
      return isIdsValid
    }

    return false
  })
]

module.exports = {
  validateCreationBody,
  validateByUserId,
  validateByLessonId,
  validateHints
}
