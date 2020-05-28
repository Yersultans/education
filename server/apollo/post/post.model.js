import mongoose from 'mongoose'

const { Schema } = mongoose

const PostSchema = new Schema(
  {
    name: String,
    imageUrl: String,
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'FromMessage' }]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.model('Post', PostSchema)
