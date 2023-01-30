const mongoose = require('mongoose');

const userPetSchema = new mongoose.Schema({ 
  _id: Number,
  imgURL: {
    type: String,
    default: '',
  },   
  name: {
    type: String,
    min: 2,
  },
  dateOfBirth: Date,
  breed: String,
  comment: String,
  userId: Number,
});


module.exports = {
  userPetSchema,
};