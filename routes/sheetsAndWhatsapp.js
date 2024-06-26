const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { TestGoogleSheetsAPI, AddRow, Delete, EditData, GetData, GetLastCount, ReceiveMessagesAndUpdateSheet, StopAndStartSendingMessages, SendWhatsappMsg, VarifyToken } = require("../controllers/sheetsAndWhatsapp.js");

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

//@desc Sends WhatsApp Messages
//@route POST google-sheets/send-whatsapp
//@access Public
router.post(
  "/send-whatsapp",
  [
    body("number", "number required").isInt({
      min: 12,
    }),

    body("template"),
  ],
  SendWhatsappMsg
);

//@desc Varifyies Backend Url in Configuration At Meta For Developers
//@route GET google-sheets/webhook
//@access Public
router.get(
  "/webhook",

  VarifyToken
);

//@desc Receives Messages And Replies
//@route POST google-sheets/webhook
//@access Public
router.post("/webhook", ReceiveMessagesAndUpdateSheet);

//@desc Stops And Starts Sending Messages
//@route POST google-sheets/stop-sending-messages
//@access Public
router.post("/stop-sending-messages", StopAndStartSendingMessages);

//@desc Sends WhatsApp Messages
//@route POST google-sheets/get-last-count
//@access Public
router.get(
  "/get-last-count",

  GetLastCount
);

module.exports = router;
