const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectToMongo = require("./config/db.js");

const { google } = require("googleapis");
const axios = require("axios");
const bodyParser = require("body-parser");

connectToMongo();

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

const phone_id = process.env.PHONE_NUMBER_ID;
const token = process.env.WABLA_API_TOKEN;
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

/* const wablaClient = new Wabla({
  token: process.env.WABLA_API_TOKEN,
  baseURL: "https://api.wablasolutions.com/v1",
}); */

app.get("/", (req, res) => {
  return res.status(200).send("Welcome To The KokaniDataCollection Back-End");
});
/* https://docs.google.com/spreadsheets/d/1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY/edit#gid=0 */
/* 
const writeGoggle = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "kokanidatacollection.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const spreadsheetId = "1TcfqySEW5ggOxIVMH2lQEGRACW8ASdhUtKZNR7GpCfY";

  const googleSheetInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  await googleSheetInstance.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "Sheet1!A:C",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["rahul", "rahul@gmail.com", "9374338737"]],
    },
  });
}; */

app.post("/send-whatsapp", async (req, res) => {
  const { phoneNumber, message } = req.body;
  try {
    const response = await axios.request(options);
    console.log("Message sent successfully:", response.data);
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0]) {
      let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      axios({
        method: "POST",
        url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. I'm Prasath, your message is " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

// Endpoint for Facebook to verify the webhook
app.get("/webhook", (req, res) => {
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
}); // <--- Add this closing brace

const port = process.env.PORT || 3001;

app.use("/google-sheets", require("./routes/sheetsAndWhatsapp.js"));
app.use("/translator", require("./routes/translator.js"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//writeGoggle();

/*  keyFile: {
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key,
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
      universe_domain: process.env.universe_domain,
    }, */
