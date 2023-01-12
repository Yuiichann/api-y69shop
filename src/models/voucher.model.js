const { Schema, model } = require('mongoose');

const VoucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    }, // 6-8 keyword include a-z, A-Z 0-9
    type: {
      type: String,
      required: true,
      enum: ['percent', 'number'],
    },
    value: {
      type: Number,
      required: true,
    },
    //   điều kiện nhận coupon
    condition: {
      type: Number,
      default: 0,
    },
    //   giảm nhìu nhất
    maxPrice: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('vouchers', VoucherSchema);
