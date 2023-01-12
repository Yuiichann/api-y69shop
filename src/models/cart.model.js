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
    // id user
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      unique: true,
    },
    // list figure cùng với số lượng của nó
    items: {
      type: [CartItemSchema],
      default: [],
    },
    // length của items
    totalItems: {
      type: Number,
      default: 0,
    },
    // tổng tiền tất cả sản phẩm (total += figure x quantities)
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
