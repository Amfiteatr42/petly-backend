const mongoose = require('mongoose');
const { getNewID } = require('../Helpers/newID.js');

const { messageSchema } = require('./schema.js');
const Message = mongoose.model('Commonchat', messageSchema);

async function getLast(req, res) {
  await Message.find()
    .where("message")
    .slice(-20)
    .exec((err, message) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      res.json({
        message: 'Last 20 messages',
        data: message,
      });
  });
}

async function addMessage({id, message}) {

  console.log (id, message)
  const newMessage = new Message({ idUser: id, message, time: new Date() });
  await newMessage.save(); 
}



module.exports = {
  getLast,
  addMessage,
 
};
