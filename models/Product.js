const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    subcategory: {
      type: String
    },
    images: [
      {
        url: String,
        alt: String
      }
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
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
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ sellerId: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
