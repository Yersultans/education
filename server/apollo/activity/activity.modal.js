import mongoose from 'mongoose'

const { Schema } = mongoose

const Activity = new Schema({
  name: String,
  desctiption: String,
  content: String,
  imageUrl: String,
  language: {
    type: String,
    enum: ['kazakh', 'russian'],
    default: 'kazakh'
  },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  videoUrl: String,
  isBlocked: String,
  isActive: Boolean
})

export default mongoose.model('Activity', Activity)
