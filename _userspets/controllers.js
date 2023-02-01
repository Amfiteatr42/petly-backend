const mongoose = require("mongoose");
const { getNewID } = require("../Helpers/newID.js");
const { uploadCLD, removeCLD } = require('../Helpers/cloudinary.js');

const { userPetSchema } = require("./schema.js");
const UserPet = mongoose.model("UsersPets", userPetSchema);

async function getUserPets(req, res) {
  const userId = req.user.id;
  await UserPet.find({ userId })
    .select(['_id', 'imgURL', 'name', 'dateOfBirth', 'breed', 'comment'])
    .exec((err, pets) => {
      if (err) {
        res.status(500).json({ "message": err });
        return;
      }
      res.json({
        message: 'Success',
        data: pets
      })
    })  
}


async function addUserPet(req, res) {
  const _id = await getNewID(UserPet);
  const userId = req.user.id;
  const pet = req.body;
  let imgURL = { url: '', publicId: '' };
  if (req.file.originalname) {
    const result = await uploadCLD(req.file.path);
    imgURL = { url: result.url, publicId: result.public_id };
    console.log("upload   result   ", result);
  } 
  const userPet = new UserPet({ _id, ...pet, userId, imgURL });    
  userPet.save(async (err, pet) => {    
    if (err) {
      res.status(500).json({ message: "Error occurred", "err": err });
      return;
    }
    res.json({
      message: "Pet added",
      data: pet,         
    });                 
  });
}

async function removeUserPet(req, res) {
  const _id = req.params.id;
  const userId = req.user.id;
  await UserPet.findOneAndDelete({_id, userId})
    .exec((err, pet) => {
        if (err) {
          res.status(500).json({ message: "Error occured", "err": err  });
          return;
        }
        res.json({
          message: "Delete success",
          data: pet
        })      
      })

}

async function updateUserPet(req, res) {
  const _id = req.params.id;
  const userId = req.user.id;
  const prop = { ...req.body };
  console.log('_id, userId ', _id, userId);

  let pet = await UserPet.findOne({ _id, userId });
  console.log('pet ', pet);  
  if (!pet) {        
    res.status(400).json({ message: "No found pet"});
    return;
  }
  if (req.file.originalname) {
    const result = await uploadCLD(req.file.path);
    pet.imgURL = { url: result.url, publicId: result.public_id };
  } 
  if (!pet.imgURL.publicId) {
    await removeCLD(pet.imgURL.publicId);
  }
  for (key in prop) {
    pet[key] = prop[key];
  }
  pet.save((err, pet) => {
    if (err) {
      res.status(500).json({ message: "Error occured", err: err});
      return;
    }
    res.json({
      message: "Update success",
      data: pet
    })
  })         
    
}

module.exports = {
  getUserPets,
  addUserPet,
  removeUserPet,
  updateUserPet,
};