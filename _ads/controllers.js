const mongoose = require("mongoose");
const { getNewID } = require("../Helpers/newID.js");


const { adSchema } = require("./schema.js");
const Ad = mongoose.model("Ads", adSchema);

async function getAllAds(req, res) { 

  let { page, limit, categoryId } = req.query;
  const prop = categoryId === undefined ? {} : { categoryId };
  const totalRecords = await Ad.find(prop).count();
  page = (page === undefined || page < 1) ? 1 : page;
  limit = (limit === undefined || limit < 4) ? totalRecords : limit;

  await Ad.find(prop)
    .select({ comments: 0, sex: 0, petname: 0, userId: 0, __v: 0 })
    .skip((Number(page) - 1) * (Number(limit)))
    .limit(Number(limit))
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

async function getMyAds(req, res) {
      const userId = req.user.id
      await Ad.find({userId})
      .select({ comments: 0, sex: 0, petname: 0, userId: 0, __v: 0 })
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
async function getAdById (req, res) {
  const _id = req.params.id;
  await Ad.findOne({_id})
    .select({ userId: 0, __v: 0 })
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

async function addAd(req, res) {
  const _id = await getNewID(Ad);
  const props = req.body;
  const userId = req.user.id;
  const newAd = new Ad({ _id, ...props, userId });
  console.log(newAd);
  newAd.save(async (err, ad) => {    
    if (err) {
      res.status(400).json({ "message": "Error occurred", "err": err });
      return;
    }
    res.json({
      message: "Ad added",
      data: ad,         
    });                 
  });
}

async function removeAd(req, res) {
  const _id = req.params.id;
  const userId = req.user.id;
  await Ad.findOneAndDelete({_id, userId})
    .exec((err, ad) => {
        if (err) {
          res.status(500).json({ message: "Error occured" });
          return;
        }
        res.json({
          message: "Delete success",
          data: ad
        })      
      })
}

async function updateAd(req, res) {
  const _id = req.params.id;
  const userId = req.user.id;
  const prop = req.body;
  await Ad.findOneAndUpdate({_id, userId}, { $set: { ...prop } }, {returnDocument: 'after'})
    .exec((err, pet) => {
      console.log (pet, prop)
      if (err) {
        res.status(500).json({ message: "Error occured" });
        return;
      }
       res.json({
        message: "Update success",
        data: pet
      })      
    })
}

async function searchAds(req, res) {}

module.exports = {
  getAllAds,
  getMyAds,
  getAdById,
  addAd,
  removeAd,
  updateAd,
  searchAds,
};