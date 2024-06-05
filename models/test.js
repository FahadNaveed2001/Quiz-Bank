const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  optionOne: {
    type: String,
    required: true,
  },
  optionTwo: {
    type: String,
    required: true,
  },
  optionThree: {
    type: String,
    required: true,
  },
  optionFour: {
    type: String,
    required: true,
  },
  optionFive: {
    type: String,
  },
  optionSix: {
    type: String,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  questionExplanation: {
    type: String,
    required: true,
  },
  optionOneExplanation: {
    type: String,
  },
  optionTwoExplanation: {
    type: String,
  },
  optionThreeExplanation: {
    type: String,
  },
  optionFourExplanation: {
    type: String,
  },
  optionFiveExplanation: {
    type: String,
  },
  optionSixExplanation: {
    type: String,
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  image: {
    type: String,
  },
  imageTwo: {
    type: String,
  },
  video: {
    type: String, 
  },
  row: {
    type: Number,
    required: true,
  },
});

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
  questions: [mcqSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
