const { Schema, model } = require('mongoose');

const CartItemSchema = new Schema({
  figure: {
    type: Schema.Types.ObjectId,
    ref: 'figures',
  },

  quantities: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model('carts', CartSchema);
