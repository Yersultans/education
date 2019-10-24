const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const FormMessage = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  form: { type: Schema.Types.ObjectId, ref: "Form" },
  content: String
});

FormMessage.plugin(mongoosePaginate);

module.exports = mongoose.model("FormMessage", FormMessage);