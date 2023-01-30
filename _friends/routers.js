const express = require("express");
const friendsControl = require("./controllers.js");
const { checkUser } = require("../middleware/usermiddleware.js");

const router = express.Router();

router.get("/", friendsControl.getFriends); //

router.post("/add", checkUser, friendsControl.addFriends); //

router.delete("/remove/:id", checkUser, friendsControl.removeFriends); //

router.patch("/update/:id", checkUser, friendsControl.updateFriends); //


module.exports = router;
