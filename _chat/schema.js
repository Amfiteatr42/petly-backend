const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  idUser: Number,
  message: String,
  time:  Date,
});

module.exports = {
  messageSchema,
};
