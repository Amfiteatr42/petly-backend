const express = require("express");
const newControl = require("./controllers.js");
const { checkUser } = require("../middleware/usermiddleware.js");

const router = express.Router();

router.get("/", newControl.getNews); //

router.post("/add", checkUser, newControl.addNews); //

router.delete("/remove/:id", checkUser, newControl.removeNews); //

router.patch("/update/:id", checkUser, newControl.updateNews); //

router.get("/search/:str", newControl.searchNews); //

module.exports = router;
