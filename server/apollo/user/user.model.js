const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema(
  {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    parentEmail: String,
    birthDate: String,
    imageUrl: String,
    role: {
      type: String,
      enum: [
        'user',
        'admin',
        'contentManager',
        'reviewer',
        'teacher',
        'schoolAdmin',
        'schoolUser'
      ],
      default: 'user'
    },
    wupai: { type: Number, default: 0 },
    avatar: { body: Number, eyes: Number, mouth: Number },
    grade: String,
    phoneNumber: String,
    parentPhoneNumber: String
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
)

User.virtual('name').get(function nameGetter() {
  return `${this.firstName} ${this.lastName}`
})

User.plugin(passportLocalMongoose, { populateFields: ['skills', 'school'] })
User.plugin(mongoosePaginate)

module.exports = mongoose.model('User', User)
