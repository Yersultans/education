import mongoose from 'mongoose'

const { Schema } = mongoose

const Lesson = new Schema({
  name: String,
  content: String,
  imageUrl: String,
  language: {
    type: String,
    enum: ['kazakh', 'russian'],
    default: 'kazakh'
  },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  videoUrl: String,
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
})

export default mongoose.model('Lesson', Lesson)
