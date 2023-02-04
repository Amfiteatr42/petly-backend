const express = require('express');
const userControl = require('./controllers.js');
const { checkUser } = require('../middleware/usermiddleware.js');
const upload = require('../Helpers/multer.js');
const {handleError} = require('../service/handleError.js')

const router = express.Router();

router.post('/signup', handleError(userControl.userRegistration));

router.post('/verify/:id/:code', handleError(userControl.verificateEmailToken));

router.post('/login', handleError(userControl.userLogin));

router.post('/logout', checkUser, handleError(userControl.userLogout));

router.get('/current', checkUser, handleError(userControl.getInfoCurrentUser));

router.patch('/update', checkUser, handleError(userControl.updateUser));

router.patch('/refresh', checkUser, handleError(userControl.refreshUser));

router.patch('/avatar', checkUser, upload.single('avatar'), handleError(userControl.patchAvatar));

router.post('/favorite/:id', checkUser, handleError(userControl.setFavoriteAds));

router.delete('/favorite/:id', checkUser, handleError(userControl.removeFavoriteAds));

module.exports = router;
