const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema(
  {
    earningId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    sellerId: {
      type: String,
      required: true,
      index: true
    },
    orderId: {
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
      default: 'USD'
    },
    commissionRate: {
      type: Number,
      required: true
    },
    commission: {
      type: Number,
      required: true
    },
    netEarnings: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'available', 'withdrawn', 'cancelled'],
      default: 'pending',
      index: true
    },
    period: {
      startDate: Date,
      endDate: Date
    },
    withdrawalId: {
      type: String,
      sparse: true
    },
    withdrawnAt: {
      type: Date
    },
    bankAccount: {
      accountHolder: String,
      accountNumber: String,
      routingNumber: String,
      bankName: String
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
earningsSchema.index({ sellerId: 1, createdAt: -1 });
earningsSchema.index({ status: 1, sellerId: 1 });
earningsSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });

module.exports = mongoose.model('Earnings', earningsSchema);
