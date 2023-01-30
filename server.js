require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const {DB_URL, PORT="3333"} = process.env;

(async function() {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Database connection successful`);
  } catch (error) {
    console.log(`error`, error);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
    console.log('=======================================')
  }); 

})();