const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  // _id: Number,
  title: {
    type: String,
    required: true,
  },
  text: String,
  link: String,
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = {
  newSchema,
};
