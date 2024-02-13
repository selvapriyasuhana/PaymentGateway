const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    default: 'created'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
});

const Payment = mongoose.model('Razorpay', paymentSchema);

module.exports = Payment;
