const mongoose = require("mongoose");

const { Schema } = mongoose;

const translatorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  sentence: {
    type: String,
    default: "",
  },
  sentence_id: {
    type: Number,
    default: 0,
  },
  answerd: {
    type: Boolean,
    default: true,
  },
  stopped: {
    type: Boolean,
    default: false,
  },
  firstReply: {
    type: Boolean,
    default: false,
  },
  templateMSG: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Translator", translatorSchema);
