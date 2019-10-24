const mongoose = require("mongoose");

const Option = mongoose.model("Option");

const { to } = require("../helpers/promise");

module.exports.getOptions = async (req, res) => {
  try {
    const [err, options] = await to(Option.find());
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(options);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.getOption = async (req, res) => {
  try {
    const { optionId } = req.params;
    if (!optionId) {
      res.status(400).send({ err: "Данные не отправлены!" });
    } 
    const [err, option] = await to(Option.findById(subjectId));
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(option);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}

module.exports.addOption = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0){
      res.status(400).send({ err: "Данные не отправлены!"});
    }
    const option = await Option.create(req.body);
    res.status(200).send(option);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}

module.exports.updateOption = async (req, res) => {
  try {
    const { optionId } = req.params;
    if(!optionId || Object.keys(req.body).length === 0){
      res.status(400).send({ err: "Данные не отправлены!"});
    }
    await Option.update({ _id: lessonId}, req.body);
    const [err, lesson] = await to(Option.findById(lessonId));
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(option);
  } catch (err) {
    console.log (err);
    res.status(500).send(err);
  }
}

module.exports.deleteOption = async (req, res) => {
  try {
    const { optionId} = req.params;
    if(!optionId) {
      console.log(err);
      res.status(400).send({ err: "Данные не отправлены!" });
    }
    const [err, option] = await to(Option.findByIdAndRemove(optionId));
    if(err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send(option);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}