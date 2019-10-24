const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const Option = new Schema({
  option: String,
  answer: {
    type: Boolean,
    default: false
  },

},{timestamps: {createdAt: 'created_at', updateAt: 'update_at'}});

Option.plugin(mongoosePaginate);

module.exports = mongoose.model("Option", Option);