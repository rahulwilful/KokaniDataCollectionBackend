const express = require("express");

const routes = express.Router();
const { getAllSentences, getSentenceById, getSentencesByTranslator } = require("../controllers/sentence.js");

//@desc GET ALL API
//@route GET sentence/getall
//@access Public
routes.get("/getall", getAllSentences);

//@desc GET ALL API
//@route GET sentence/getbyid/:id
//@access Public
routes.get("/getbyid/:id", getSentenceById);

//@desc GET ALL API
//@route GET sentence/getbytranslatorid/:id
//@access Public
routes.get("/get-sentences-by-translator/:id", getSentencesByTranslator);

module.exports = routes;
