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
        required: false,
      },
      USMLE: {
        type: String,
        required: false,
      },
    },
  ],

  attemptedTests: [
    {
      test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
      },
      sections: [
        {
          sectionNumber: {
            type: Number,
            required: true,
          },
          questions: [
            {
              questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
              },
              selectedOption: {
                type: String,
                default: null,
              },
            },
          ],
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
      timeInSeconds: {
        type: Number,
        default: "0",
      },
      sectionInfo: {
        type: String,
      },
      testInfo: {
        type: Boolean,
        default: true,
      }
    },
  ],

 
  // temporaryAttemptedTests: [
  //   {
  //     test: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Test",
  //     },
  //     temporaryQuestions: [
  //       {
  //         questionId: {
  //           type: mongoose.Schema.Types.ObjectId,
  //           ref: "Q/A-MCQ",
  //         },
  //         selectedOption: String,
  //       },
  //     ],
  //     sectionNumber: {
  //       type: Number,
  //       required: true,
  //     },
  //     obtainedScore2: {
  //       type: Number,
  //       required: true,
  //     },
  //     timeInSeconds: {
  //       type: Number,
  //       required: true,
  //     },
  //   },
  // ],
  feedbacks: {
    type: [
      {
        name: {
          type: String,
          required: false,
        },
        text: {
          type: String,
          required: false,
        },
        school: {
          type: String,
          required: false,
        },
        rating: {
          type: Number,
          enum: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
          required: false,
        },
        feedbackCreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },

  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Q/A-notifications",
    },
  ],
  
});

const User = mongoose.model("Q/A-User", userSchema);

module.exports = User;
