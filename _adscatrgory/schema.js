const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // _id: {
  //   type: Number,
  //   require: true,
  //   unique: true
  // },
  nameCategory: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = {
  categorySchema,
};
