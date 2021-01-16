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
  correctAnswerImg: String,
  correctAnswerVideo: String,
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' }
})

export default mongoose.model('Question', QuestionSchema)
