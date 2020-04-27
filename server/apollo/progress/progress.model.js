import mongoose from 'mongoose'

const { Schema } = mongoose

const Progress = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    userAnswers: [String],
    isCorrect: Boolean
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'update_at' } }
)

export default mongoose.model('Progress', Progress)
