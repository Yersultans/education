import mongoose from 'mongoose'

const { Schema } = mongoose

const QuestionSchema = new Schema({
  text: String,
  options: [String],
  level: Number,
  correctAnswers: [String],
  language: {
    type: String,
    enum: ['kazakh', 'russian'],
    default: 'kazakh'
  },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  lessons: { type: Schema.Types.ObjectId, ref: 'Lesson' }
})

export default mongoose.model('Question', QuestionSchema)
