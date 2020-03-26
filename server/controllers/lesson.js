const mongoose = require('mongoose')

const Lesson = mongoose.model('Lesson')

const { to } = require('../helpers/promise')

module.exports.getLessons = async (req, res) => {
  try {
    const [err, lessons] = await to(Lesson.find())
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(lessons)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getLesson = async (req, res) => {
  try {
    const { lessonId } = req.params
    if (!lessonId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, lesson] = await to(Lesson.findById(lessonId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    return res.status(200).send(lesson)
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
}

module.exports.addLesson = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const lesson = await Lesson.create(req.body)
    res.status(200).send(lesson)
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
}

module.exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params
    if (!lessonId || Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    await Lesson.update({ _id: lessonId }, req.body)
    const [err, lesson] = await to(Lesson.findById(lessonId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(lesson)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params
    if (!lessonId) {
      console.log(err)
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, lesson] = await to(Lesson.findByIdAndRemove(lessonId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(lesson)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
