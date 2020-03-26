import mongoose from 'mongoose'

const { Schema } = mongoose

const Subject = new Schema({
  name: String,
  imageUrl: String,
  language: {
    type: String,
    enum: ['kazakh', 'russian'],
    default: 'kazakh'
  }
})

export default mongoose.model('Subject', Subject)
