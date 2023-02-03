const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  logo: String,
  name: String,
  friendUrl: String,
  workingHours: [
    {
      day: {
        type: String,
        enum: ['MN', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
      },
      from: {
        type: String,
        default: '-',
      },
      to: {
        type: String,
        default: '-',
      },
    },
  ],
  adress: String,
  adressUrl: String,
  email: String,
  phone: String,
});

module.exports = {
  friendSchema,
};
