require('dotenv').config();
const mongoose = require('mongoose');
const { app } = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { DB_URL, PORT = "3333" } = process.env;
const {addMessage} = require('./_chat/controllers.js')

io.on('connection', (socket) => {
  socket.on('chatMessage', async (msg) => {
    console.log('catch msg: ', msg);
    await addMessage(msg)
    io.emit('chatMessage', msg);
  });
});

(async function() {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Database connection successful`);
  } catch (error) {
    console.log(`error`, error);
    process.exit(1);
  }
  http.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
    console.log('=======================================')
  }); 

})();