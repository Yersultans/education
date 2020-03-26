const mongoose = require('mongoose')

const Question = mongoose.model('Question')

const { to } = require('../helpers/promise')

module.exports.getQuestions = async (req, res) => {
  try {
    const [err, questions] = await to(Question.find())
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(questions)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    if (!questionId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, question] = await to(Question.findById(questionId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(question)
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
}

module.exports.addQuestion = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const question = await Question.create(req.body)
    res.status(200).send(question)
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
}

module.exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    if (!questionId || Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    await Question.update({ _id: lessonId }, req.body)
    const [err, question] = await to(Lesson.findById(questionId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(question)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    if (!questionId) {
      console.log(err)
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, question] = await to(Question.findByIdAndRemove(lessonId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(question)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
