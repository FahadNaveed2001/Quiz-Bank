const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema({
  usmleStep: {
    type: Number,
    required: true,
  },
  USMLE: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  optionSix: {
    type: String,
    required: false,
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
    required: true,
  },
  optionTwoExplanation: {
    type: String,
    required: true,
  },
  optionThreeExplanation: {
    type: String,
    required: true,
  },
  optionFourExplanation: {
    type: String,
    required: true,
  },
  optionFiveExplanation: {
    type: String,
    required: true,
  },
  optionSixExplanation: {
    type: String,
    required: false,
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
  video: {
    type: String, 
  },
});

const MCQ = mongoose.model("Q/A-MCQ", mcqSchema);

module.exports = MCQ;
