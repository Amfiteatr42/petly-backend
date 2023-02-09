const express = require("express");
const messageController = require("./controllers.js");

const router = express.Router();

router.get("/last", messageController.getLast); 


module.exports = router;
