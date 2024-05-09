const express = require("express");
const routes = express.Router();
const { body } = require("express-validator");
const { addTranslator, deleteTranslator, getAllTranslators, updateTranslator, toggleMessageSendingOfUser, getTranslatorById } = require("../controllers/translator");

//@desc Create User API
//@route POST translator/add
//@access Public
routes.post(
  "/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("number", "Enter a Valid number").isNumeric().isLength({
      min: 10,
    }),
  ],
  addTranslator
);

//@desc GET ALL API
//@route GET translator/getall
//@access Public
routes.get("/getall", getAllTranslators);

//@desc Update User API
//@route POST translator/update
//@access Public
routes.post(
  "/update/:id",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("number", "Enter a Valid number").isNumeric().isLength({
      min: 10,
    }),
    body("sentence"),
    body("sentence_id"),
  ],
  updateTranslator
);

//@desc Delete User API
//@route POST translator/delete
//@access Public
routes.delete("/delete/:id", deleteTranslator);

//@desc Delete User API
//@route POST translator/delete
//@access Public
routes.post("/toggle-messages-sending-of-user/:id", toggleMessageSendingOfUser);

//@desc Get User By Id  API
//@route POST translator/get_by_id
//@access Public
routes.get("/get_by_id/:id", getTranslatorById);

//@desc GET ALL API
//@route GET translator/
//@access Public
routes.post("/");

module.exports = routes;
