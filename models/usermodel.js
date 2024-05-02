const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  attemptedQuizzes: [
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Q/A-MCQ",
      },
      questions: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Q/A-MCQ",
          },
          selectedOption: String,
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      totalScore: {
        type: Number,
        required: true,
      },
      obtainedScore: {
        type: Number,
        required: true,
      },
      usmleSteps: {
        type: Number,
        required: true,
      },
      USMLE: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("Q/A-User", userSchema);

module.exports = User;
