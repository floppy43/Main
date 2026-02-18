const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema(
  {
    shareId: {
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
    sellers: [
      {
        sellerId: {
          type: String,
          required: true
        },
        sellerName: String,
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100
        },
        amount: {
          type: Number,
          required: true,
          min: 0
        },
        status: {
          type: String,
          enum: ['pending', 'available', 'redeemed', 'cancelled'],
          default: 'pending'
        },
        redeemedAt: Date,
        redeemedAmount: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    totalRedeemed: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'available', 'partially_redeemed', 'fully_redeemed', 'cancelled'],
      default: 'pending',
      index: true
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
    expiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
shareSchema.index({ orderId: 1 });
shareSchema.index({ 'sellers.sellerId': 1, status: 1 });
shareSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Share', shareSchema);
