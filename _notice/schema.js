const { Schema, SchemaTypes } = require('mongoose');

const adSchema = new Schema({
  categoryId: Number,
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
  userId: {
    type: String,
    required: true,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'title is required'],
  },
  petname: String,
  dateofbirth: String,
  breed: String,
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'sex is required'],
  },
  location: {
    type: String,
    required: [true, 'location is required'],
  },
  price: {
    type: String,
    default: 0,
  },
  comments: String,
});

module.exports = {
  adSchema,
};
