const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  aboutUsText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ABOUTUS = mongoose.model("Q/A-aboutus", aboutUsSchema);

module.exports = ABOUTUS;
