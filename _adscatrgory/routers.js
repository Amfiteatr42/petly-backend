const express = require('express');
const categoryControl = require('./controllers.js');
const { checkUser } = require('../middleware/usermiddleware.js');

const router = express.Router();

router.get('/', categoryControl.getAllCategory);

router.post('/add', checkUser, categoryControl.addCategory);

router.patch('/update/:id', checkUser, categoryControl.updateCategory);

module.exports = router;
