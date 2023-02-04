const mongoose = require('mongoose');
const Joi = require('joi');
const fs = require('fs/promises');
const { userSchema } = require('./schema.js');
const User = mongoose.model('User', userSchema);

const { hashPassword, comparePasswords } = require('../Helpers/password.js');
const { generateToken } = require('../Helpers/token.js');

const { getNewID } = require('../Helpers/newID.js');
const { uploadCLD, removeCLD } = require('../Helpers/cloudinary.js');
const { validateDate } = require('../Helpers/validateDate.js');

function makeValidate(req, res) {
    const schema = Joi.object({        
        email: Joi.string()
            .email({ minDomainSegments: 2 }),
        password: Joi.string()
            .pattern(/^[ а-яА-Яa-zA-Z0-9]+$/)
            .min(7)
            .max(32),
        userName: Joi.string()
            .pattern(/^[ а-яА-Яa-zA-Z0-9]+$/)
            .min(3),
        city: Joi.string()
            .pattern(/^[ а-яА-Яa-zA-Z,-]+$/),
        phone: Joi.string()
            .pattern(/^[\+0-9-()]+$/),
        birthday: Joi.date()
            .greater('01-01-1923')
            .less('01-01-2023'),
        });  
    const validate = schema.validate({
        email,
        password,
        userName,
        city,
        phone,
        birthday
        } = req.body,);
    if (validate.error) {
        res.status(400).send(JSON.stringify({"message": `validate failed with error ${validate.error}`}));
        return false;
    };
    return true;
}

async function userRegistration(req, res) {
    if (!makeValidate(req, res)) return;
    const { email, password, userName, city, phone, birthday } = req.body;
    console.log( email, password, userName, city, phone );
    
    const newUser = new User({});
    newUser.password = await hashPassword(password);
    newUser._id = await getNewID(User); 
    newUser.email = email; 
    if (validateDate(birthday)) {
        newUser.birthday = validateDate(birthday);
    } else {
        res.status(400).send(JSON.stringify({"message": `validate failed with error: Validate birthday failed`}));
        return false;
    }
    newUser.userName = userName;    
    newUser.city = city;    
    newUser.phone = phone; 
    const verificationEmailToken = (Math.floor(Math.random()*10000)).toString().padStart(4,'0');
    newUser.verificationEmailToken = verificationEmailToken;

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // const msg = {
  //     to: newUser.email,
  //     from: 'selutin.odessa@meta.ua',
  //     subject: `Confirm your e-mail`,
  //     text: `Your sicret code: ${newUser.verificationToken}`,
  // }
  // await sgMail.send(msg)
  //     .then(() => {
  //         console.log ("post sended ", newUser.email)
  //     })
  //     .catch(err => {
  //         res.status(400).json({ "message": "Error occurred", "err": err });
  //         return;
  //     });

  newUser.save(async (err, data) => {
    if (err) {
      switch (err.code) {
        case 11000:
          res.status(400).json({ message: 'Email in use', err: err });
          break;

        default:
          res.status(400).json({ message: 'Error occurred', err: err });
          break;
      }
    } else {
      res.json({
        message: 'Hello, new freind!!!',
        data: { _id: data._id, email: data.email },
        verificationEmailToken: verificationEmailToken,
      });
    }
  });
}
async function verificateEmailToken(req, res) {
    const {id, code} = req.params;
    const user = await User.findById(Number(id));
    if (user === null) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    if (user.verificationEmailToken === '') {
        res.status(400).json({ message: "Bad request" });
        return;
    }
    if (user.verificationEmailToken !== code) {
        res.status(400).json({ message: "Bad token" });
        return;
    }     
    user.verificationEmailToken = '';
    user.verifyEmail = true;
    const longToken = await generateToken({ id: user._id });
    user.longToken = longToken;
    const token = await generateToken({ id: user._id });
    await user.save();
    res.json({
        message: "Verification successful",
        data: {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            city: user.city,
            phone: user.phone,
            birthday: user.birthday,
        },
        token: token,
        longToken: longToken        
    });
    
}

async function userLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ "message": "Email or password is wrong" });
        return;
    }
    const passwordIsRight = await comparePasswords(password, user.password);           
    if (passwordIsRight) {
        const token = await generateToken({ id: user._id });
        const longToken = await generateToken({ id: user._id });
        await User.findByIdAndUpdate(user._id, { $set: { longToken } })
            .select('-publicId -password -longToken -verifyEmail -verifyEmail -verificationEmailToken -__v')
            .exec((err, user) => {
                if (err) res.status(500).json({"message": err});
                res.json({
                    message: "Authorization is successful",
                    data: user,
                    token: token,
                    longToken: longToken
                });
            })        
    } else {
        res.status(400).json({ "message": "Email or password is wrong"});
    }   
}

async function userLogout(req, res) {
    const _id = req.user.id; 
    const longToken = '';
    await User.findByIdAndUpdate(_id, { $set: { longToken } })
       .select('-publicId -password -longToken -verifyEmail -verifyEmail -verificationEmailToken -__v')
        .exec((err, user) => {
            if (err) {
                res.status(500).json({ "message": err });
                return;
            }
            if (!user) {
                res.status(400).json({ message: `user not found with id: ${id}` });
                return;
            }
            res.json({
                message: "Logout",
                data: user,
             
            });
        })         
}

async function getInfoCurrentUser(req, res) {
    const id = req.user.id;     
    await User.findById(id)
        .select('-publicId -password -longToken -verifyEmail -verifyEmail -verificationEmailToken -__v')
        .exec((err, user) => {
            if (err) res.status(500).json({"message": err});
            if (user === null) {
                res.status(400).json({message: `user not found with id: ${id}`});
                return;
            }    
            res.json({
                message: "Current user",
                data: user                
            });
        })   
}

async function updateUser(req, res) {
    if (!makeValidate(req, res)) return;
    const id = req.user.id;  
    const prop = req.body;   
    const { birthday } = req.body;
    if (birthday) {
        if (!validateDate(birthday)) {
            res.status(400).send(JSON.stringify({ "message": `validate failed with error: Validate birthday failed` }));
            return;
        }
    }
    if (prop) {
        await User.findByIdAndUpdate(id, { $set: { ...prop } }, { returnDocument: 'after' })
                .select('-publicId -password -longToken -verifyEmail -verifyEmail -verificationEmailToken -__v')
                .exec((err, user) => {
                    if (err) {
                        res.status(500).json({ "message": err });
                        return;
                    }
                    if (user === null) {
                        res.status(400).json({"message": `user not found with id: ${id}`});
                        return;
                    }    
                    res.json({
                        message: "Info updated",
                        data: user
                    });
        })       
    }
}

async function refreshUser(req, res) {
    let [_, longToken] = req.headers.authorization.split(" ");
    const id = req.user.id; 
    const user = await User.findById(id);
    if (user === null) {
            res.status(400).json({ message: `user not found with id: ${id}` });
            return;
    }
    if (user.longToken === "") {
        res.status(400).json({ "message": `Not authorised` });
        return;

    }
    console.log("longToken    ===> ", longToken);
    console.log("user.longToken    ===> ", user.longToken);

    if (user.longToken !== longToken) {
        user.longToken = "";
        user.save();
        res.status(400).json({ message: `Bad long token. You need autorisation` });
        return;
    }        
    longToken = await generateToken({ id: user._id });
    const token = await generateToken({ id: user._id });
    await User.findByIdAndUpdate(id, { longToken })
        .select('-publicId -password -longToken -verifyEmail -verifyEmail -verificationEmailToken -__v')
        .exec((err, user) => {
            if (err) {
                res.status(500).json({ "message": err });
                return;
            }
            res.json({
                message: "Tokens updated",
                data: user,
                token: token,
                longToken: longToken
            });
        });
}

async function patchAvatar(req, res) {
    const _id = req.user.id; 
    const user = await User.findById(_id)
        .select('-password -longToken -verifyEmail -verificationEmailToken -__v');
    if (!user) {
        res.status(400).json({ message: `user not found with id: ${id}` });
        return;
    }
    const result = await uploadCLD(req.file.path);
    console.log("user.avatarURL.publicId", user.avatarURL.publicId);
    
    if (user.avatarURL.publicId) {
        await removeCLD(user.avatarURL.publicId);
    }
    user.avatarURL.url = result.url;
    user.avatarURL.publicId = result.public_id;
    user.save((err, user) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        if (user === null) {
          res.status(400).json({ message: `user not found with id: ${id}` });
          return;
        }
        res.json({
        message: "Aavatar update",
        data: user,
        });
      });
  }


async function refreshUser(req, res) {
  let [_, longToken] = req.headers.authorization.split(' ');
  const id = req.user.id;
  const user = await User.findById(id);
  if (user === null) {
    res.status(400).json({ message: `user not found with id: ${id}` });
    return;
  }
  if (user.longToken === '') {
    res.status(400).json({ message: `Not authorised` });
    return;
  }
  console.log('longToken    ===> ', longToken);
  console.log('user.longToken    ===> ', user.longToken);

  if (user.longToken !== longToken) {
    user.longToken = '';
    user.save();
    res.status(400).json({ message: `Bad long token. You need autorisation` });
    return;
  }
  longToken = await generateToken({ id: user._id });
  const token = await generateToken({ id: user._id });
  await User.findByIdAndUpdate(id, { longToken })
    .select(['_id', 'email', 'userName', 'city', 'phone'])
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      res.json({
        message: 'Tokens updated',
        data: user,
        token: token,
        longToken: longToken,
      });
    });
}

async function updateAvatar(req, res) {
  try {
    const id = req.user.id;
    await User.findById(id).exec(async (err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (user === null) {
        res.status(400).json({ message: `user not found with id: ${id}` });
        return;
      }
      try {
        await fs.access(user.avatarURL, fs.constants.F_OK);
        await fs.unlink(user.avatarURL);
      } catch (err) {
        console.log('наверное нет такого файла или что то не так');
      }
      user.avatarURL = req.file.newpath;
      user.save();
    });

    await fs.cp(req.file.path, req.file.newpath);
    res.json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: 'File did not save' });
  } finally {
    await fs.unlink(req.file.path);
  }
}
async function patchAvatar(req, res) {
  const _id = req.user.id;
  const user = await User.findById(_id);
  if (!user) {
    res.status(400).json({ message: `user not found with id: ${id}` });
    return;
  }

  const result = await uploadCLD(req.file.path);
  console.log('upload   result   ', result);

  if (user.avatarURL.publicId) {
    await removeCLD(user.avatarURL.publicId);
  }
  user.avatarURL.url = result.url;
  user.avatarURL.publicId = result.public_id;
  user.save((err, user) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred', err: err });
      return;
    }
    res.json({
      message: 'Aavatar update',
      data: { avatarURL: user.avatarURL },
    });
  });
}
async function setFavoriteAds(req, res) {
  const _id = req.user.id;
  const adId = req.params.id;
  const user = await User.findById(_id);
  user.favoriteAds.push(Number(adId));
  user.save(async (err, user) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred', err: err });
      return;
    }
    res.json({
      message: 'Favorite ad added',
      data: user,
    });
  });
}
async function removeFavoriteAds(req, res) {
  const _id = req.user.id;
  const adId = req.params.id;
  const user = await User.findById(_id);
  user.favoriteAds.splice(user.favoriteAds.indexOf(adId), 1);
  user.save(async (err, user) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred', err: err });
      return;
    }
    res.json({
      message: 'Favorite ad added',
      data: user,
    });
  });
}

module.exports = {
    userRegistration,
    verificateEmailToken,
    userLogin,
    userLogout,
    getInfoCurrentUser,
    updateUser,
    refreshUser,
    patchAvatar,
    setFavoriteAds,
    removeFavoriteAds,
};
