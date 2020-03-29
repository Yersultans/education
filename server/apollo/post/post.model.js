import mongoose from 'mongoose'

const { Schema } = mongoose

const PostSchema = new Schema({
  name: String,
  imageUrl: String,
  content: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model('Post', PostSchema)
