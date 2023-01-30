const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  _id: Number,
  tytle: {
    type: String,
    required: true,
  },
  text: String,
  imgURL: String,
  data: {
    type: Date,
    default: new Date(),
  },
});
 
module.exports = {
  newSchema,
};