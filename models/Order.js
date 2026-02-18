const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    customerId: {
      type: String,
      required: true,
      index: true
    },
    items: [
      {
        productId: String,
        productName: String,
        sellerId: String,
        sellerName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
          default: 'pending'
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    commission: {
      type: Number,
      default: 0,
      min: 0
    },
    commissionRate: {
      type: Number,
      default: 0.1
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'credit_card', 'debit_card'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    trackingNumber: {
      type: String
    },
    notes: {
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
    deliveredAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ 'items.sellerId': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
