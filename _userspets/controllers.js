const mongoose = require("mongoose");
const { getNewID } = require("../Helpers/newID.js");


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
  const userPet = new UserPet({ _id, ...pet, userId });
  
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
  const prop = req.body;
  await UserPet.findOneAndUpdate({_id, userId}, { $set: { ...prop } }, {returnDocument: 'after'})
    .exec((err, pet) => {
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