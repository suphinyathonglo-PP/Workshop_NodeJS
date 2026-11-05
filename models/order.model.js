const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // unitPrice: {
  //   type: Number,
  //   required: true
  // },
  totalPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('order', orderSchema)