const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { TestGoogleSheetsAPI, AddRow, Delete, EditData, GetData, ReceiveMessagesAndReply, VarifyToken } = require("../controllers/sheetsAndWhatsapp.js");

//@desc Test User API
//@route GET google-sheets/
//@access Public
router.get("/", TestGoogleSheetsAPI);

//@desc Adds New Row
//@route GET google-sheets/addrow
//@access Public
router.post(
  "/addrow",
  [
    body("name", "name required").isLength({
      min: 2,
    }),

    body("email", "Enter a Valid Email").isEmail(),

    body("number", "Enter a Number").isLength({
      min: 10,
    }),
  ],
  AddRow
);

//@desc Gets All The Data
//@route GET google-sheets/getdata
//@access Public
router.get(
  "/getdata",

  GetData
);

//@desc Edits Row
//@route GET google-sheets/edit/:id
//@access Public
router.post(
  "/edit/:id",
  [
    body("name", "name required").isLength({
      min: 2,
    }),

    body("email", "Enter a Valid Email").isEmail(),

    body("number", "Enter a Number").isLength({
      min: 10,
    }),
  ],
  EditData
);

//@desc Deletes Row
//@route POST google-sheets/delete/:id
//@access Public
router.post(
  "/delete/:id",

  Delete
);

//@desc Edits Row
//@route GET google-sheets/send-whatsapp
//@access Public
router.get("/send-whatsapp", VarifyToken);

//@desc Edits Row
//@route GET google-sheets/webhook
//@access Public
router.get(
  "/webhook",

  VarifyToken
);

//@desc Edits Row
//@route POST google-sheets/webhook
//@access Public
router.post(
  "/webhook",

  ReceiveMessagesAndReply
);

module.exports = router;
