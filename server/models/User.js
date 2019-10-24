const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema(
  {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    birthDate: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin"
    },
    phoneNumber: String
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

User.virtual("name").get(function nameGetter() {
  return `${this.firstName} ${this.lastName}`;
});

User.plugin(passportLocalMongoose);
User.plugin(mongoosePaginate);

module.exports = mongoose.model("User", User);
