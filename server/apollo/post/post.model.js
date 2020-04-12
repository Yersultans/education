import mongoose from 'mongoose'

const { Schema } = mongoose

const PostSchema = new Schema(
  {
    name: String,
    imageUrl: String,
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'update_at' } }
)

export default mongoose.model('Post', PostSchema)
