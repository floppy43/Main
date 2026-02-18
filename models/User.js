const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer'
    },
    profileImage: {
      type: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    sellerProfile: {
      shopName: String,
      shopDescription: String,
      shopImage: String,
      rating: {
        type: Number,
        default: 0
      },
      totalOrders: {
        type: Number,
        default: 0
      },
      verified: {
        type: Boolean,
        default: false
      }
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
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
userSchema.index({ email: 1, role: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
