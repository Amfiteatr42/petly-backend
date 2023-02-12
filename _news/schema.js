const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
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
