import mongoose from 'mongoose'

const { Schema } = mongoose

const QuestionSchema = new Schema({
  text: String,
  options: [String],
  level: Number,
  type: {
    type: String,
    enum: ['MultipleChoice', 'OpenEnded']
  },
  correctAnswers: [String],
  isMultipleAnswers: Boolean
})

export default mongoose.model('Question', QuestionSchema)
