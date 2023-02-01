const express = require("express");
const adsControl = require("./controllers.js");
const { checkUser } = require("../middleware/usermiddleware.js");
const upload = require("../Helpers/multer.js");

const router = express.Router();

router.get("/", adsControl.getAllAds); // 

router.get("/my", checkUser, adsControl.getMyAds); //

router.get("/ad/:id", checkUser, adsControl.getAdById); // 

router.post("/add", checkUser, upload.single('petImg'), adsControl.addAd); // 

router.delete("/remove/:id", checkUser, adsControl.removeAd); // 

router.patch("/update/:id", checkUser, upload.single('petImg'), adsControl.updateAd); //

router.get("/search", adsControl.searchAds); // 

module.exports = router;
