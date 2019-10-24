const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Subject = new Schema({
  name: String, 
  imgUrl: String
}, {timestamps: {createdAt: 'created_at', updateAt: 'update_at'}});

Subject.plugin(mongoosePaginate);

module.exports = mongoose.model("Subject", Subject);