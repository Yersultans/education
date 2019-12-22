const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Subject = new Schema({
  name: String, 
  imageUrl: String,
  history: String, 
  Wikipedia: String,
  instructions: String,
  ingredients: [String],
}, {timestamps: {createdAt: 'created_at', updateAt: 'update_at'}});

Subject.plugin(mongoosePaginate);

module.exports = mongoose.model("Subject", Subject);