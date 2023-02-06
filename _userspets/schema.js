const mongoose = require('mongoose');

const userPetSchema = new mongoose.Schema({
  // _id: Number,
  imgURL: {
    url: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  name: {
    type: String,
    min: 2,
  },
  dateOfBirth: Date,
  breed: String,
  comment: String,
  userId: mongoose.SchemaTypes.ObjectId,
});

module.exports = {
  userPetSchema,
};
