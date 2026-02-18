const mongoose = require('mongoose');

const stripeCustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      index: true
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true
    },
    name: String,
    defaultPaymentMethodId: {
      type: String,
      sparse: true
    },
    paymentMethods: [
      {
        paymentMethodId: String,
        brand: String,
        last4: String,
        expiryMonth: Number,
        expiryYear: Number,
        isDefault: Boolean,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    subscriptions: [
      {
        subscriptionId: String,
        priceId: String,
        status: String,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
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
stripeCustomerSchema.index({ customerId: 1 });
stripeCustomerSchema.index({ email: 1 });

module.exports = mongoose.model('StripeCustomer', stripeCustomerSchema);
