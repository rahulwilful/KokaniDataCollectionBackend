const express = require("express");
const routes = express.Router();
const { body } = require("express-validator");
const { addTranslator } = require("../controllers/translator");

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
routes.post("/getall");

//@desc Update User API
//@route POST translator/update
//@access Public
routes.post("/update");

//@desc Delete User API
//@route POST translator/delete
//@access Public
routes.post("/delete");

//@desc Get User By Id  API
//@route POST translator/get_by_id
//@access Public
routes.post("/get_by_id");

//@desc GET ALL API
//@route GET translator/
//@access Public
routes.post("/");

module.exports = routes;
