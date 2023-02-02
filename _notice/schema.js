const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  _id: {
    type: Number,
    index: true,
  },
  categoryId: Number,
   imgURL: {
    url: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    }
  }, 
  userId: {
    type: String,
    required: true,
  },
  title: String,
  petname: String,
  dateofbirth: Date,
  breed: String,
  sex: {
    type: String,
    enum: ['male', 'female']
  },
  location: String,
  price: {
    type: Number,
    default: 0,
  },
  comments: String

});


module.exports = {
  adSchema,
};