const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Question = new Schema({
  question: String,
  options: [{ type: Schema.Types.ObjectId, ref: "Option"}],

},{timestamps: {createdAt: 'created_at', updateAt: 'update_at'}});

Question.plugin(mongoosePaginate);

module.exports = mongoose.model("Question", Question);