const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Form = new Schema({
  name: String,
  description: String
});

Form.plugin(mongoosePaginate);

module.exports = mongoose.model("Form", Form);