const express = require("express");
const usersPetsControl = require("./controllers.js");
const { checkUser } = require("../middleware/usermiddleware.js");

const router = express.Router();

router.get("/", checkUser, usersPetsControl.getUserPets); // получаем животных пользователя, id пользователя из токена

router.post("/add", checkUser, usersPetsControl.addUserPet); // добавляем животное пользователя, id пользователя из токена

router.delete("/remove/:id", checkUser, usersPetsControl.removeUserPet); // удаляем животное пользователя по id животного

router.patch("/update/:id", checkUser, usersPetsControl.updateUserPet); // редактируем животное пользователя по id животного

module.exports = router;
