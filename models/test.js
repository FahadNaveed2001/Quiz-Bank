const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  testDescription: {
    type: String,
    required: true,
  },
  usmleStep: {
    type: Number,
    required: true,
  },
  TestCreatedAt: {
    type: Date,
    default: Date.now,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
