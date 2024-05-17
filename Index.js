//dep imports
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const fs = require("fs");

//files imports
const connectDB = require("./config/mongoconnection");
const User = require("./models/usermodel");
const MCQ = require("./models/mcqmodel");
const predefinedAdmin = require("./models/adminmodel");
const { body, validationResult } = require("express-validator");
const { addMCQ } = require("./mcqroutes/addmcq");
const { getMCQs } = require("./mcqroutes/getmcqs");
const { getMCQById } = require("./mcqroutes/submcqroutes/singlemcq");
const { addCommentToMCQ } = require("./mcqroutes/commentroutes/addcomment");
const {
  getMCQsWithComments,
} = require("./mcqroutes/submcqroutes/mcqwithcomment");
const { verifyEmail } = require("./userroutes/emailverification");
const { deleteMCQ } = require("./mcqroutes/deletemcq");
const { deleteQuiz } = require("./userroutes/quizroutes/deletequiz");
const { saveQuizzes } = require("./userroutes/quizroutes/addquiz");
const { getUserQuizzes } = require("./userroutes/quizroutes/userquiz");
const { getLatestQuiz } = require("./userroutes/quizroutes/latestquiz");
const { userSignup } = require("./userroutes/usersignup");
const { userLogin } = require("./userroutes/userlogin");
const { getUsers } = require("./userroutes/getusers");
const { forgotPassword } = require("./userroutes/forgotpassword");
const {
  verifyToken,
  routesWithoutToken,
} = require("./middlewares/authmiddleware");
const storage = require("./config/storageconfig");
const { addFeedback } = require("./userroutes/feedbackroutes/addfeedback");
const {
  deleteFeedback,
} = require("./userroutes/feedbackroutes/deletefeedback");
const { getFeedbacks } = require("./userroutes/feedbackroutes/getfeedbacks");
const { editFeedback } = require("./userroutes/feedbackroutes/editfeedback");
const {
  getFeedbackById,
} = require("./userroutes/feedbackroutes/getsinglefeedback");
const {
  getUserFeedbacks,
} = require("./userroutes/feedbackroutes/usersfeedback");
const {
  getAllFeedbacks,
} = require("./userroutes/feedbackroutes/adminfeedbacks");
// const { deleteMCQImage } = require("./mcqroutes/deletemcqimage");

//app and port
const app = express();
const PORT = process.env.PORT || 8000;

//db connection
connectDB();

//app uses
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads", "videos"))
);

//Jwt Secret
const JWT_SECRET = process.env.JWT_SECRET_KEY;

//middlewares
app.use((req, res, next) => {
  if (routesWithoutToken.includes(req.path)) {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

//root route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    success: true,
    message: "ZAP-70 is running!",
  });
  console.log("Root route accessed");
});

//multer storage
const upload = multer({ storage: storage });

//mcq routes
app.post(
  "/add-mcqs",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addMCQ
);
app.get("/mcqs", getMCQs);
app.get("/mcq/:mcqId", getMCQById);
app.post("/add-comment/:mcqId", addCommentToMCQ);
app.get("/mcqs-with-comments", getMCQsWithComments);
app.delete("/delete-mcq/:mcqId", deleteMCQ);
app.put(
  "/edit-mcqs/:mcqId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    const { mcqId } = req.params;
    try {
      const mcqToUpdate = await MCQ.findById(mcqId);

      if (!mcqToUpdate) {
        return res.status(404).json({ error: true, message: "MCQ not found." });
      }
      const {
        usmleStep,
        USMLE,
        question,
        optionOne,
        optionTwo,
        optionThree,
        optionFour,
        optionFive,
        optionSix,
        correctAnswer,
        questionExplanation,
        optionOneExplanation,
        optionTwoExplanation,
        optionThreeExplanation,
        optionFourExplanation,
        optionFiveExplanation,
        optionSixExplanation,
      } = req.body;
      mcqToUpdate.usmleStep = usmleStep;
      mcqToUpdate.USMLE = USMLE;
      mcqToUpdate.question = question;
      mcqToUpdate.optionOne = optionOne;
      mcqToUpdate.optionTwo = optionTwo;
      mcqToUpdate.optionThree = optionThree;
      mcqToUpdate.optionFour = optionFour;
      mcqToUpdate.optionFive = optionFive;
      mcqToUpdate.optionSix = optionSix;
      mcqToUpdate.correctAnswer = correctAnswer;
      mcqToUpdate.questionExplanation = questionExplanation;
      mcqToUpdate.optionOneExplanation = optionOneExplanation;
      mcqToUpdate.optionTwoExplanation = optionTwoExplanation;
      mcqToUpdate.optionThreeExplanation = optionThreeExplanation;
      mcqToUpdate.optionFourExplanation = optionFourExplanation;
      mcqToUpdate.optionFiveExplanation = optionFiveExplanation;
      mcqToUpdate.optionSixExplanation = optionSixExplanation;

      if (req.files["image"]) {
        mcqToUpdate.image = req.files["image"][0].filename;
      }
      if (req.files["video"]) {
        mcqToUpdate.video = req.files["video"][0].filename;
      }
      const updatedMCQ = await mcqToUpdate.save();
      res.status(200).json({
        status: "success",
        success: true,
        message: "MCQ updated successfully",
        data: updatedMCQ,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error Updating MCQ",
        errorMessage: error.message,
      });
    }
  }
);
app.delete("/mcq/:id/image", async (req, res) => {
  try {
    const mcqId = req.params.id;
    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ error: true, message: "MCQ not found." });
    }
    if (!mcq.image) {
      return res
        .status(400)
        .json({ error: true, message: "MCQ does not have an image." });
    }
    deleteImage(mcq.image);
    mcq.image = null;
    await mcq.save();
    res.status(200).json({
      status: "success",
      success: true,
      message: "Image deleted successfully from MCQ.",
      data: mcq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while deleting image from MCQ.",
      errorMessage: error.message,
    });
  }
});
const deleteImage = (filename) => {
  const imagePath = path.join(__dirname, "uploads", filename);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
    } else {
      console.log("Image deleted successfully.");
    }
  });
};
app.delete("/mcq/:id/video", async (req, res) => {
  try {
    const mcqId = req.params.id;
    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ error: true, message: "MCQ not found." });
    }
    if (!mcq.video) {
      return res
        .status(400)
        .json({ error: true, message: "MCQ does not have a video." });
    }
    deleteVideo(mcq.video);
    mcq.video = null;
    await mcq.save();
    res.status(200).json({
      status: "success",
      success: true,
      message: "Video deleted successfully from MCQ.",
      data: mcq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while deleting video from MCQ.",
      errorMessage: error.message,
    });
  }
});
const deleteVideo = (filename) => {
  const videoPath = path.join(__dirname, "uploads", "videos", filename);

  fs.unlink(videoPath, (err) => {
    if (err) {
      console.error("Error deleting video:", err);
    } else {
      console.log("Video deleted successfully.");
    }
  });
};

//quiz routes
app.delete("/delete-quiz/:userId/:quizId", (req, res) => {
  deleteQuiz(User, req, res);
});
app.post("/save-quizzes", async (req, res) => {
  saveQuizzes(User, req, res);
});
app.get("/user-quizzes/:userId", async (req, res) => {
  getUserQuizzes(User, req, res);
});
app.get("/latest-quiz/:userId", async (req, res) => {
  getLatestQuiz(User, req, res);
});
app.get("/user-quiz/:userId/:quizId", async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const user = await User.findById(userId).populate({
      path: "attemptedQuizzes.questions.questionId",
      model: "Q/A-MCQ",
    });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }
    const quiz = user.attemptedQuizzes.find(
      (quiz) => quiz._id.toString() === quizId
    );
    if (!quiz) {
      return res
        .status(404)
        .json({ error: true, message: "Quiz not found for the user." });
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error retrieving quiz",
      errorMessage: error.message,
    });
  }
});

app.get("/user-attempted-questions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({
      path: "attemptedQuizzes.questions.questionId",
      model: "Q/A-MCQ",
    });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }
    const attemptedQuestions = user.attemptedQuizzes.reduce(
      (allQuestions, quiz) => {
        return allQuestions.concat(
          quiz.questions
            .map((question) => {
              if (
                question &&
                question.questionId &&
                !question.questionId.deleted
              ) {
                const selectedOption = question.selectedOption;
                const correctAnswer = question.questionId.correctAnswer;
                const isCorrect = selectedOption === correctAnswer;
                return {
                  question: question.questionId,
                  selectedOption: selectedOption,
                  isCorrect: isCorrect,
                };
              } else {
                return null;
              }
            })
            .filter((question) => question !== null)
        );
      },
      []
    );

    res.status(200).json({
      status: "success",
      success: true,
      message: "User Attempted Questions",
      data: attemptedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error retrieving attempted questions",
      errorMessage: error.message,
    });
  }
});

// app.get("/unattempted-questions/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findById(userId).populate({
//       path: "attemptedQuizzes.questions.questionId",
//       model: "Q/A-MCQ",
//     });
//     if (!user) {
//       return res.status(404).json({ error: true, message: "User not found." });
//     }

//     const allMCQs = await MCQ.find(); // Get all MCQs from the database

//     const attemptedQuestionIds = user.attemptedQuizzes.reduce(
//       (allQuestions, quiz) => {
//         return allQuestions.concat(
//           quiz.questions.map((question) => question.questionId)
//         );
//       },
//       []
//     );

//     // Filter out the unattempted questions
//     const unattemptedQuestions = allMCQs.filter((mcq) => {
//       return !attemptedQuestionIds.includes(mcq._id);
//     });

//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Unattempted questions by the user",
//       data: unattemptedQuestions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: true,
//       message: "Error retrieving unattempted questions",
//       errorMessage: error.message,
//     });
//   }
// });

//user routes
app.post(
  "/user-signup",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    userSignup(User, req, res);
  }
);
app.get("/verify-email", async (req, res) => {
  verifyEmail(User, req, res);
});
app.post("/user-login", async (req, res) => {
  userLogin(User, predefinedAdmin, req, res);
});
app.get("/users", async (req, res) => {
  getUsers(User, req, res);
});
app.post("/forgot-password", async (req, res) => {
  forgotPassword(User, jwt, nodemailer, req, res);
});
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, repeatPassword } = req.body;

  try {
    if (password !== repeatPassword) {
      return res
        .status(404)
        .json({ error: true, message: "Password Is Not Matching" });
    }
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ error: true, message: "Token Is Not Valid" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, {
          password: hashedPassword,
        });
        return res.status(200).json({
          status: "success",
          success: true,
          message: "Password Reseted successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Error During Reset Process MCQ",
      errorMessage: error.message,
    });
  }
});

//feedback routes
app.post("/add-feedback/:userId", async (req, res) => {
  addFeedback(User, req, res);
});
app.get("/feedbacks", async (req, res) => {
  getFeedbacks(User, req, res);
});
app.delete("/feedback/:feedbackId", async (req, res) => {
  deleteFeedback(User, req, res);
});
app.put("/edit-feedback/:feedbackId", async (req, res) => {
  editFeedback(User, req, res);
});
app.get("/feedback/:feedbackId", async (req, res) => {
  getFeedbackById(User, req, res);
});
app.get("/user-feedbacks/:userId", async (req, res) => {
  getUserFeedbacks(User, req, res);
});
app.get("/all-feedbacks", async (req, res) => {
  getAllFeedbacks(User, req, res);
});
app.get("/others-feedbacks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const usersExceptCurrent = await User.find({ _id: { $ne: userId } });
    const allFeedbacksExceptCurrent = [];
    for (const user of usersExceptCurrent) {
      for (const feedback of user.feedbacks) {
        const feedbackData = {
          userId: user._id,
          email: user.email,
          feedbackId: feedback._id,
          name: feedback.name,
          text: feedback.text,
          school: feedback.school,
          rating: feedback.rating,
          feedbackCreatedAt: feedback.feedbackCreatedAt,
        };
        allFeedbacksExceptCurrent.push(feedbackData);
      }
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "All other feedbacks retrieved successfully",
      data: allFeedbacksExceptCurrent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while retrieving feedbacks",
      errorMessage: error.message,
    });
  }
});

app.get("/attempted-questions-analysis", async (req, res) => {
  try {
    const users = await User.find();
    const analysisResults = {};

    for (const user of users) {
      for (const quiz of user.attemptedQuizzes) {
        for (const question of quiz.questions) {
          const questionId = question.questionId.toString();
          let questionAnalysis = analysisResults[questionId];
          if (!questionAnalysis) {
            const optionSelections = {};
            const questionDetails = await MCQ.findById(questionId)
              .select("-__v")
              .lean();
            if (questionDetails && questionDetails.options) {
              for (const optionKey in questionDetails.options) {
                optionSelections[questionDetails.options[optionKey]] = 0;
              }
            }
            if (
              question.selectedOption !== null &&
              question.selectedOption !== undefined
            ) {
              optionSelections[question.selectedOption]++;
            }
            questionAnalysis = {
              totalAttempts: 1,
              questionDetails: questionDetails,
              optionSelections: optionSelections,
            };
            analysisResults[questionId] = questionAnalysis;
          } else {
            questionAnalysis.totalAttempts++;
            if (
              question.selectedOption !== null &&
              question.selectedOption !== undefined
            ) {
              questionAnalysis.optionSelections[question.selectedOption]++;
            }
          }
        }
      }
    }

    res.status(200).json({
      status: "success",
      success: true,
      message: "Attempted questions analysis",
      data: analysisResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error retrieving attempted questions analysis",
      errorMessage: error.message,
    });
  }
});

app.get("/all-questions", async (req, res) => {
  try {
    const users = await User.find();
    const allQuestions = users.reduce((questions, user) => {
      const userQuestions = user.attemptedQuizzes.flatMap((quiz) =>
        quiz.questions.map((question) => ({
          questionId: question.questionId,
          selectedOption: question.selectedOption,
        }))
      );
      return questions.concat(userQuestions);
    }, []);
    const optionCount = allQuestions.reduce((count, question) => {
      if (!count[question.questionId]) {
        count[question.questionId] = {};
      }
      if (question.selectedOption !== "") {
        count[question.questionId][question.selectedOption] =
          (count[question.questionId][question.selectedOption] || 0) + 1;
      }
      return count;
    }, []);

    const questionsDetails = [];
    for (const questionId of Object.keys(optionCount)) {
      const question = await MCQ.findById(questionId);
      if (question) {
        const attempts = Object.values(optionCount[questionId]).reduce(
          (total, count) => total + count,
          0
        );
        questionsDetails.push({
          questionId: question._id,
          question: question.question,
          optionsCount: optionCount[questionId],
          attempts: attempts,
          details: question,
        });
      }
    }

    res.status(200).json({
      status: "success",
      success: true,
      message: "All questions retrieved successfully",
      data: questionsDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while retrieving questions",
      errorMessage: error.message,
    });
  }
});

//server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
