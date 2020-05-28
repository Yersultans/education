import mongoose from 'mongoose'

const { Schema } = mongoose

const FormMessage = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: { type: Schema.Types.ObjectId, ref: 'FormMessage' },
    content: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    form: { type: Schema.Types.ObjectId, ref: 'Form' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.model('FormMessage', FormMessage)
