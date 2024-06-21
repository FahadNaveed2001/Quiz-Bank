const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  testName: {
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

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
