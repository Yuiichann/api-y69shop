const { Schema, model } = require('mongoose');

const usedVoucherSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    used_vouchers: {
      type: [Schema.Types.ObjectId],
      ref: 'vouchers',
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('usedVoucher', usedVoucherSchema);
