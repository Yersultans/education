import mongoose from 'mongoose'

const { Schema } = mongoose

const Subject = new Schema({
  name: String,
  imageUrl: String,
  description: String,
  price: Number,
  language: {
    type: String,
    enum: ['kazakh', 'russian'],
    default: 'kazakh'
  },
  isActive: Boolean,
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
})

export default mongoose.model('Subject', Subject)
