const mongoose = require("mongoose");

const Translator = require("./Translator.js");

const { Schema } = mongoose;

const sentenceSchema = new Schema({
  translator_id: {
    type: "ObjectId",
    ref: "Translator",
    required: true,
  },
  sentence: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  sentence_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Sentence", sentenceSchema);
