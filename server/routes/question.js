const express = require('express')

const router = express.Router()

const {
  getQuestions,
  getQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/question')

router.get('/questions', getQuestions)
router.get('/questions/:questionId', getQuestion)
router.post('/questions', addQuestion)
router.post('/questions/:questionId', updateQuestion)
router.delete('/questions/questionId', deleteQuestion)

module.exports = router
