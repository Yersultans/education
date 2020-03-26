const mongoose = require('mongoose')

const Form = mongoose.model('Form')

const { to } = require('../helpers/promise')

module.exports.getForms = async (req, res) => {
  try {
    const [err, forms] = await to(Form.find())
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(forms)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getForm = async (req, res) => {
  try {
    const { formId } = req.params
    if (!formId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, form] = await to(Form.findById(formId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(form)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.addForm = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const form = await Form.create(req.body)
    res.status(200).send(form)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.updateForm = async (req, res) => {
  try {
    const { formId } = req.params
    if (!formId || Object.keys(req.body).length === 0) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    await Form.update({ _id: formId }, req.body)
    const [err, form] = await to(Form.findById(formId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(form)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.deleteForm = async (req, res) => {
  try {
    const { formId } = req.params
    if (!formId) {
      console.log(err)
      res.status(400).send({ err: 'Данные не отправлены!' })
    }
    const [err, form] = await to(Form.findByIdAndRemove(formId))
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    res.status(200).send(form)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
