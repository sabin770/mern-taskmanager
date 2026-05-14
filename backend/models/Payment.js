const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pidx: {
      type: String, // Khalti payment index
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number, // in paisa (NPR * 100)
      required: true,
    },
    amountNPR: {
      type: Number, // human-readable
      required: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    khaltiResponse: {
      type: mongoose.Schema.Types.Mixed, // store full Khalti response
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
