const { Schema, model } = require('mongoose');

const OrderItemSchema = new Schema({
  figure: {
    type: Schema.Types.ObjectId,
    ref: 'figures',
  },
  quantities: {
    type: Number,
    default: 1,
  },
});

const OrderSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['cash'],
      default: 'cash',
    },
    status: {
      type: String,
      required: true,
      enum: ['cancelled', 'waiting', 'confirmed', 'delivering', 'finish'], // [đã hủy, chờ xác nhận, đã xác nhận, đang giao, hoàn thành]
      default: 'waiting',
    },
    voucher: {
      type: Schema.Types.ObjectId,
      ref: 'vouchers',
    },
    //   tổng tiền sau khi đã trừ từ voucher
    total: {
      type: Number,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model('orders', OrderSchema);
