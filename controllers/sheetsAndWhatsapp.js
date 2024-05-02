const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const Translator = require("../Models/Translator.js");
const LastCount = require("../Models/LastCount.js");
const Sentence = require("../Models/Sentence.js");

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

    return res.status(200).json({ result: response.data.values /* .slice(1) */ });
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
  /////////////////////////////////////////////////////////////////
  const authClientObject = await auth.getClient();

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  //////////////////////////////////////////////////////////////
  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0]) {
      let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number : " + phon_no_id);
      console.log("from : " + from);
      console.log("boady param : " + msg_body);

      const msg = msg_body.split(",");

      //check if translation message is present
      if (!msg[1]) {
        console.log("message[0] : ", msg[0], " message : ", msg);
        InvalidFormatMSG(from);
        /* axios({
          method: "POST",
          url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: " plzz provide valid translation in following format ( number , translation ) eg :- (2,भाषांतर) ",
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        }); */
        console.log("invalid translation format");
        res.sendStatus(405);
      }

      const checkUser = await Translator.findOne({ number: from });

      //check if the user is valid
      if (!checkUser) {
        console.log("unauthorised translator");
        res.sendStatus(404);
      }
      //check if msg[0] is an intiger and not '0' as well else send invalid format message
      if (msg[0] != 0) {
        console.log("sentence number : ", msg[0]);

        const sentence = await Sentence.create({
          translator_id: checkUser._id,
          sentence: checkUser.sentence,
          translation: msg[1],
          sentence_id: checkUser.sentence_id,
        });

        const user = await Translator.findOneAndUpdate(
          { number: from },
          {
            sentence: "",
            answerd: true,
            sentence_id: null,
          },
          {
            new: true,
          }
        );

        console.log("user : ", user);

        const row = await googleSheetInstance.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `Sheet1!D${msg[0]}`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [[msg[1]]],
          },
        });

        console.log("Row Update Successfull : ");
      } else {
        console.log("message[0] : ", msg[0], " message : ", msg);
        InvalidFormatMSG(from);
        /*   axios({
          method: "POST",
          url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: " plzz provide valide translation in following format ( number , translation ) eg :- (2,भाषांतर) ",
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        }); */
        console.log("invalid translation format");
        res.sendStatus(405);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
};

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

  try {
    const last = await LastCount.find();
    const lastId = last[0]._id;
    let lastCount = last[0].lastCount;
    const checkLastCount = lastCount;
    console.log("last : ", last);
    console.log("LastCount : ", lastCount);

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
    console.log(translators);

    for (let i in translators) {
      console.log("data[i] : ", data[i], " number : ", translators[i].number);
      if (data[i]) {
        //check if answerd previous translation else send previos sentence
        if (translators[i].answerd == true) {
          let msg = data[i].toString();

          axios({
            method: "POST",
            url: "https://graph.facebook.com/v13.0/" + phone_id + "/messages?access_token=" + token,
            data: {
              messaging_product: "whatsapp",
              to: translators[i].number,
              text: {
                body: " " + lastCount + " , " + msg + ". ",
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });

          const user = await Translator.findOneAndUpdate(
            {
              number: translators[i].number,
            },
            {
              sentence: msg,
              sentence_id: lastCount,
              answerd: false,
            },
            { new: true }
          );

          /* const sentence = await Sentence.create({
            translator_id: translators[i]._id,
            sentence: msg,
            translation: msg,
            sentence_id: lastCount,
          }); */

          lastCount = lastCount + 1;
        } else {
          const prevSentence = translators[i].sentence;
          const sentence_id = translators[i].sentence_id;
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v13.0/" + phone_id + "/messages?access_token=" + token,
            data: {
              messaging_product: "whatsapp",
              to: translators[i].number,
              text: {
                body: " " + sentence_id + " , " + prevSentence + ". ",
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        setTimeout(() => {
          console.log("100ms");
        });
      } else {
        console.log("No data is available  to send further sentences");
        break;
      }
    }

    console.log("checkLastCount : ", checkLastCount);
    console.log("lastCount", lastCount);
    console.log("lastId", lastId);

    if (lastCount > checkLastCount) {
      console.log("updating");
      const lastCount2 = await LastCount.findByIdAndUpdate(
        { _id: lastId },
        {
          lastCount: lastCount,
        },
        {
          new: true,
        }
      );
      console.log("after update lastCount", lastCount2);
    }
  } catch (err) {
    console.log({ error: err, message: "message sending faild" });
  }
};

setInterval(() => {
  SendAutomatedMsg();
}, 10000);

//@desc Sends WhatsApp Messages
//@route POST google-sheets/send-whatsapp
//@access Public
const SendWhatsappMsg = async (req, res) => {
  const { phoneNumber, message } = req.body;

  const data = matchedData(req);
  console.log("data : ", data);

  try {
    var options = {
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${phone_id}/messages`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: data.number || "+91 9767589256",
        type: data.template || "template",
        template: { name: "hello_world", language: { code: "en_US" } },
      },
    };

    const response = await axios.request(options);
    console.log("Message sent successfully:", response.data);
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
};

//@desc Sends WhatsApp Messages
//@route POST google-sheets/get-last-count
//@access Public
const GetLastCount = async (req, res) => {
  try {
    const lastCount = await LastCount.find();
    console.log("result : ", lastCount);
    const lastCount2 = lastCount[0].lastCount;
    console.log("lastCount : ", lastCount2);
    res.status(201).json({ result: lastCount });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const InvalidFormatMSG = async (number) => {
  try {
    await axios({
      method: "POST",
      url: "https://graph.facebook.com/v13.0/" + phone_id + "/messages?access_token=" + token,
      data: {
        messaging_product: "whatsapp",
        to: number,
        text: {
          body: " plzz provide valide translation in following format ( number , translation ) eg :- (2,भाषांतर) ",
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("invalid translation format");
    res.sendStatus(405);
  } catch (error) {
    console.error("error : ", error);
  }
  console.log("invalid translation format");
  res.sendStatus(405);
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
  GetLastCount,
};
