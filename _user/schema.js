const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  avatarURL: {
    url: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userName: {
    type: String,
    required: [true, 'Name is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  phone: String,
  favoriteAds: [mongoose.SchemaTypes.ObjectId],
  birthday: Date,
  longToken: {
    type: String,
    default: '',
  },
  verifyEmail: {
    type: Boolean,
    default: false,
  },
  verificationEmailToken: {
    type: String,
    default: '',
  },
});

module.exports = {
  userSchema,
};
