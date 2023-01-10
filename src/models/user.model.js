const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/yuiichan/image/upload/v1673092107/y69shop/assets/avatar_default.jpg',
    },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

module.exports = mongoose.model('users', UserSchema);
