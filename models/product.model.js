const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String
  }
}, { timestamps: true })

module.exports = mongoose.model('product', productSchema)