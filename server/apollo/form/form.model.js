import mongoose from 'mongoose'

const { Schema } = mongoose

const Form = new Schema(
  {
    name: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'FormMessage' }]
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'update_at' } }
)

export default mongoose.model('Form', Form)
