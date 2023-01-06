const { Schema, model } = require('mongoose');

const CartModel = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'figures',
      },
    ],
    totalItem: {
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

module.exports = model('carts', CartModel);
