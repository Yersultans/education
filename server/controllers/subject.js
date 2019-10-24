const mongoose = require("mongoose");

const Subject = mongoose.model("Subject");

const { to } = require("../helpers/promise");

module.exports.getSubjects = async (req, res) => {
  try {
    const [err, subjects] = await to(Subject.find());
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(subjects);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.getSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId) {
      res.status(400).send({ err: "Данные не отправлены!" });
    } 
    const [err, subject] = await to(Subject.findById(subjectId));
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(subject);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}

module.exports.addSubject = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0){
      res.status(400).send({ err: "Данные не отправлены!"});
    }
    const subject = await Subject.create(req.body);
    res.status(200).send(subject);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}

module.exports.updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    if(!subjectId || Object.keys(req.body).length === 0){
      res.status(400).send({ err: "Данные не отправлены!"});
    }
    await Subject.update({ _id: subjectId}, req.body);
    const [err, subject] = await to(Subject.findById(subjectId));
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(subject);
  } catch (err) {
    console.log (err);
    res.status(500).send(err);
  }
}

module.exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    if(!subjectId) {
      console.log(err);
      res.status(400).send({ err: "Данные не отправлены!" });
    }
    const [err, subject] = await to(Subject.findByIdAndRemove(subjectId));
    if(err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(subject);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}