const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    orderId: {
      type: String,
      required: true,
      index: true
    },
    customerId: {
      type: String,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'credit_card', 'debit_card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
      index: true
    },
    stripePaymentIntentId: {
      type: String,
      sparse: true
    },
    paypalTransactionId: {
      type: String,
      sparse: true
    },
    cardLast4: {
      type: String
    },
    cardBrand: {
      type: String
    },
    description: {
      type: String
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    },
    refunds: [
      {
        refundId: String,
        amount: Number,
        reason: String,
        status: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    errorMessage: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
paymentSchema.index({ customerId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
