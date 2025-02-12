const mongoose = require("mongoose");

const loveSchema = new mongoose.Schema({
  name1: {
    type: String,
    required: true,
  },
  name2: {
    type: String,
    required: true,
  },
  lovePercentage: {
    type: Number,
    required: true,
  },
});

const Love = mongoose.model("Love", loveSchema);

module.exports = Love;
