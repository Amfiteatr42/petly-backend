const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nameCategory: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = {
  categorySchema,
};
