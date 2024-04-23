const mongoose = require("mongoose");

const { Schema } = mongoose;

const lastCountSchema = new Schema({
  lastCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("LastCount", lastCountSchema);
