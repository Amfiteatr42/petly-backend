const { string } = require('joi');
const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  _id: Number,
  logo: {
    type: Buffer,
    default: ""
  },
  name: String,
  friendUrl: String,
  workingHours: [
    {
      day: {
        type: String,
        enum: ['MN', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
      },
      from: {
        type: String,
         default: "-"
      },
      to: {
        type: String,
        default: "-"
      }
    }
  ],
  adress: String,
  adressUrl: String,
  email: String,
  phone: String,
  
  
});


module.exports = {
  friendSchema,
};