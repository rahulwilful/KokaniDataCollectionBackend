const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const Translator = require("../Models/Translator.js");

const fs = require("fs");

const secret = "test";

const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const axios = require("axios");
const dotenv = require("dotenv").config();

const phone_id = process.env.PHONE_NUMBER_ID;
const token = process.env.WABLA_API_TOKEN;
const private_key = process.env.PRIVATE_KEY;
let modifiedString = private_key.replace(/\\n/g, "\n");

var options = {
  method: "POST",
  url: `https://graph.facebook.com/v15.0/${phone_id}/messages`,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  data: {
    messaging_product: "whatsapp",
    to: "+91 9767589256",
    type: "template",
    template: { name: "hello_world", language: { code: "en_US" } },
  },
};

const keyFile = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: modifiedString,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

// Convert the object to JSON format
const jsonData = JSON.stringify(keyFile, null, 2); // null and 2 for pretty formatting
// Write the JSON data to a file
fs.writeFileSync("kokanidatacollection1.json", jsonData);

const auth = new google.auth.GoogleAuth({
  keyFile: "kokanidatacollection1.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";
//////////////////////////////////////////////////////////////////////////
const TestGoogleSheetsAPI = async (req, res) => {
  return res.status(200).send("GoogleSheets API test successfull");
};

//@desc Adds New Row
//@route GET google-sheets/addrow
//@access Public
const AddRow = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  //if error return
  if (!errors.isEmpty()) {
    // logger.error(`${ip}: API /api/v1/user/add  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  console.log(data, auth);
  const authClientObject = await auth.getClient();

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  try {
    const row = await googleSheetInstance.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[data.name, data.email, data.number]],
      },
    });
    return res.status(200).json({ result: row });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//@desc Gets All The Data
//@route GET google-sheets/getdata
//@access Public
const GetData = async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "kokanidatacollection1.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClientObject = await auth.getClient();

  const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  try {
    const response = await googleSheetInstance.spreadsheets.values.get({
      spreadsheetId,
      range: "sheet1",
    });

    const data = response.data.values;

    for (let i in data) {
      console.log("what bro ", i);
    }
    console.log(data);

    return res.status(200).json({ result: response.data.values.slice(1) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//@desc Edits Row
//@route POST google-sheets/edit/:id
//@access Public
const EditData = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  //if error return
  if (!errors.isEmpty()) {
    // logger.error(`${ip}: API /api/v1/user/add  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const auth = new google.auth.GoogleAuth({
    keyFile: "kokanidatacollection1.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log(data, auth);
  const authClientObject = await auth.getClient();

  const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const id = req.params.id;
  try {
    const row = await googleSheetInstance.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: `Sheet1!A${id}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[data.name, data.email, data.number]],
      },
    });
    return res.status(200).json({ result: row });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//@desc Deletes Row
//@route POST google-sheets/delete/:id
//@access Public
const Delete = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  //if error return
  if (!errors.isEmpty()) {
    // logger.error(`${ip}: API /api/v1/user/add  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "kokanidatacollection1.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClientObject = await auth.getClient();

  const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const id = req.params.id;
  try {
    const row = await googleSheetInstance.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: `Sheet1!A${id}:C${id}`,
    });
    return res.status(200).json({ result: row });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//@desc Varifyies Backend Url in Configuration At Meta For Developers
//@route GET google-sheets/webhook
//@access Public
const VarifyToken = async (req, res) => {
  const VERIFY_TOKEN = process.env.VARIFY_TOKEN;

  // Parse the query params
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check if the mode and token are in the query string
  if (mode && token) {
    // Verify the mode and token
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token to confirm the webhook
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      // Respond with a 403 Forbidden if verification fails
      res.sendStatus(403);
    }
  } else {
    // Respond with a 400 Bad Request if mode or token are missing
    res.sendStatus(400);
  }
};

//@desc Receives Messages And Replies
//@route POST google-sheets/webhook
//@access Public
const ReceiveMessagesAndUpdateSheet = async (req, res) => {
  try {
    const authClientObject = await auth.getClient();
    const googleSheetInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });

    const body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (!body_param.object || !body_param.entry || !body_param.entry[0].changes || !body_param.entry[0].changes[0].value.messages || !body_param.entry[0].changes[0].value.messages[0]) {
      return res.sendStatus(404);
    }

    const phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
    const from = body_param.entry[0].changes[0].value.messages[0].from;
    const msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

    console.log("phone number " + phon_no_id);
    console.log("from " + from);
    console.log("body param " + msg_body);

    const msg = msg_body.split(",");

    // Check if translation message is present
    if (!msg[1]) {
      await sendInvalidTranslationResponse(phon_no_id, from);
      return res.sendStatus(405);
    }

    const user = await Translator.findOne({ number: from });

    if (!user) {
      console.log("unauthorized translator");
      return res.sendStatus(404);
    }

    // Check if msg[0] is an integer and not '0'
    const sentenceNumber = parseInt(msg[0]);
    if (!isNaN(sentenceNumber) && sentenceNumber !== 0) {
      console.log("sentence number: ", sentenceNumber);
      await googleSheetInstance.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Sheet1!D${sentenceNumber}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[msg[1]]],
        },
      });

      await Translator.findOneAndUpdate(
        { number: from },
        {
          sentence: "",
          answered: true,
          sentence_id: null,
        }
      );

      console.log("Row Update Successful");
    } else {
      await sendInvalidTranslationResponse(phon_no_id, from);
      return res.sendStatus(405);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};

const sendInvalidTranslationResponse = async (phon_no_id, from) => {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v13.0/${phon_no_id}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: "Please provide valid translation in the following format (number, translation) eg: (2,भाषांतर)",
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Invalid translation format");
  } catch (error) {
    console.error("Error sending invalid translation response:", error);
  }
};

let lastCount = 1;

//@desc Receives Messages And Replies
//@route POST google-sheets/webhook
//@access Public
const SendAutomatedMsg = async (req, res) => {
  /////////////////////////////////////////////////////////////////
  const auth = new google.auth.GoogleAuth({
    keyFile: "kokanidatacollection1.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClientObject = await auth.getClient();

  const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  /////////////////////////////////////////////////////////////////////////////////////
  //let body_param = req.body;

  //console.log(JSON.stringify(body_param, null, 2));
  console.log("LastCount : ", lastCount);
  const phone_no = "9767589256";
  try {
    const rows = await googleSheetInstance.spreadsheets.values.get({
      spreadsheetId,
      range: `Sheet1!B${lastCount}:B`,
    });
    if (!rows.data.values) {
      console.log("No data to send ");
      return;
    }
    const data = rows.data.values;
    const translators = await Translator.find();
    //console.log("data length : ", data.length);
    console.log("data : ", data);
    //console.log(translators);

    for (let i in translators) {
      console.log("data[i] : ", data[i]);
      if (data[i]) {
        //check if answerd previous translation else send previos sentence
        if (translators[i].answerd == true) {
          let msg = data[i].toString();

          axios({
            method: "POST",
            url: "https://graph.facebook.com/v13.0/" + phone_id + "/messages?access_token=" + token,
            data: {
              messaging_product: "whatsapp",
              to: "91" + translators[i].number,
              text: {
                body: " " + lastCount + " , " + msg + ". ",
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });

          let id = translators[i]._id;
          console.log("Id : ", id);
          await Translator.findOneAndUpdate(
            {
              number: translators[i].number,
            },
            {
              sentence: msg,
              sentence_id: lastCount,
              answerd: false,
            }
          );

          lastCount = lastCount + 1;
        } else {
          const prevSentence = translators[i].sentence;
          const sentence_id = translators[i].sentence_id;
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v13.0/" + phone_id + "/messages?access_token=" + token,
            data: {
              messaging_product: "whatsapp",
              to: "91" + translators[i].number,
              text: {
                body: " " + sentence_id + " , " + prevSentence + ". ",
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      } else {
        console.log("No data is available  to send further sentences");
        break;
      }
    }
  } catch (err) {
    console.log({ error: err, message: "message sending faild" });
  }
};

setInterval(() => {
  SendAutomatedMsg();
}, 30000);

//@desc Sends WhatsApp Messages
//@route POST google-sheets/send-whatsapp
//@access Public
const SendWhatsappMsg = async (req, res) => {
  const { phoneNumber, message } = req.body;
  try {
    const response = await axios.request(options);
    console.log("Message sent successfully:", response.data);
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
};

module.exports = {
  TestGoogleSheetsAPI,
  AddRow,
  GetData,
  EditData,
  Delete,
  VarifyToken,
  ReceiveMessagesAndUpdateSheet,
  SendWhatsappMsg,
  SendAutomatedMsg,
  sendInvalidTranslationResponse,
};
