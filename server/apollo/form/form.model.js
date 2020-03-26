import mongoose from 'mongoose'

const { Schema } = mongoose

const Form = new Schema(
  {
    name: String,
    description: String,
    messages: { type: Schema.Types.ObjectId, ref: 'FormMessage' }
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'update_at' } }
)

export default mongoose.model('Form', Form)
