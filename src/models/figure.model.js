const mongoose = require('mongoose');

const FigureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    original_price: {
      type: Number,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['scale-figure', 'nendoroid', 'pop-up-parade', 'figma', 'r-18', 'others'],
    },
    scale: {
      type: String,
      required: true,
      enum: ['non-scale', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/10', '1/12'],
    },

    in_stock: {
      type: Number,
      required: true,
    },

    sold: {
      type: Number,
      default: 0,
    },

    manufacturer: {
      type: String,
    },

    character: {
      type: String,
    },

    series: {
      type: String,
    },

    size: {
      type: String,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    collections: {
      type: Array,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FigureSchema.index({ title: 'text' });

module.exports = mongoose.model('figures', FigureSchema);
