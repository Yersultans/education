const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Lesson = new Schema({
  name: String,
  content: String, 
  imageUrl: String,
  wikipedia: String,
  history: String,
  otherNames: [String],
  subject: {type: Schema.Types.ObjectId, ref: "Subject"}
}, {timestamps: {createdAt: 'created_at', updateAt: 'update_at'}});

Lesson.plugin(mongoosePaginate);

module.exports = mongoose.model("Lesson", Lesson);