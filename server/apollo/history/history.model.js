import mongoose from 'mongoose'

const { Schema } = mongoose

const History = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Progress' }],
    correctAnswers: Number,
    total: Number
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.model('History', History)
