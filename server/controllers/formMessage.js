const mongoose = require('mongoose')

const FormMessage = mongoose.model('FormMessage')

const { to } = require('../helpers/promise')

module.exports.getFormMessages = async (req, res) => {
  try {
    const [err, formMessages] = await to(FormMessage.find())
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(formMessages)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getFormMessage = async (req, res) => {
  try {
    const { formMessageId } = req.params
    if (!formMessageId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, formMessage] = await to(FormMessage.findById(formMessageId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(formMessage)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.addFormMessage = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const formMessage = await FormMessage.create(req.body)
    res.status(200).send(formMessage)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.updateFormMessage = async (req, res) => {
  try {
    const { formMessageId } = req.params
    if (!formMessageId || Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    await FormMessage.update({ _id: formId }, req.body)
    const [err, formMessage] = await to(FormMessage.findById(formMessageId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(formMessage)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.deleteFormMessage = async (req, res) => {
  try {
    const { formMessageId } = req.params
    if (!formMessageId) {
      console.log(err)
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, formMessage] = await to(Form.findByIdAndRemove(formMessageId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(formMessage)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
