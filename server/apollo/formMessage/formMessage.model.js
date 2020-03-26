import mongoose from 'mongoose'

const { Schema } = mongoose

const FormMessage = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: { type: Schema.Types.ObjectId, ref: 'FormMessage' },
    content: String
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'update_at' } }
)

export default mongoose.model('FormMessage', FormMessage)
