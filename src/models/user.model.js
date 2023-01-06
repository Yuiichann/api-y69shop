const mongoose = require('mongoose');

const UserModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

module.exports = mongoose.model('users', UserModel);
