const express = require('express');
const userControl = require('./controllers.js');
const { checkUser } = require('../middleware/usermiddleware.js');
const upload = require('../Helpers/multer.js');




const router = express.Router();

router.post('/signup', userControl.userRegistration);

router.post('/verify/:id/:code', userControl.verificateEmailToken);

router.post('/login', userControl.userLogin);

router.post('/logout', checkUser, userControl.userLogout);

router.get('/current', checkUser, userControl.getInfoCurrentUser);

router.patch('/update', checkUser, userControl.updateUser);

router.patch('/refresh', checkUser, userControl.refreshUser);

router.patch('/avatar', checkUser, upload.single('avatar'), userControl.patchAvatar);

router.post('/favorite/:id', checkUser, userControl.setFavoriteAds);

router.delete('/favorite/:id', checkUser, userControl.removeFavoriteAds);

module.exports = router;
