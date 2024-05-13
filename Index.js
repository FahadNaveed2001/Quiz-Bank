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

//Jwt Secret
const JWT_SECRET = process.env.JWT_SECRET_KEY;

app.use((req, res, next) => {
  if (routesWithoutToken.includes(req.path)) {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    success: true,
    message: "Server is running!",
  });
  console.log("Root route accessed");
});

const upload = multer({ storage: storage });

app.post("/add-mcqs", upload.single("image"), addMCQ);

app.get("/mcqs", getMCQs);

app.get("/mcq/:mcqId", getMCQById);

app.post("/add-comment/:mcqId", addCommentToMCQ);

app.get("/mcqs-with-comments", getMCQsWithComments);

app.delete("/delete-mcq/:mcqId", deleteMCQ);

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
          quiz.questions.map((question) => {
            return {
              question: question.questionId,
              selectedOption: question.selectedOption,
            };
          })
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

////////////////////////////////////////////////////////////////////////
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

// app.get("/attempted-questions", async (req, res) => {
//   try {
//     const users = await User.find();
//     const allAttemptedQuestions = [];
//     for (const user of users) {
//       const attemptedQuestions = user.attemptedQuizzes.reduce(
//         (allQuestions, quiz) => {
//           return allQuestions.concat(
//             quiz.questions.map((question) => {
//               return {
//                 questionId: question.questionId,
//                 selectedOption: question.selectedOption,
//               };
//             })
//           );
//         },
//         []
//       );
//       allAttemptedQuestions.push(...attemptedQuestions);
//     }
//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Attempted questions by every user",
//       data: allAttemptedQuestions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: true,
//       message: "Error retrieving attempted questions by every user",
//       errorMessage: error.message,
//     });
//   }
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
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

app.put("/edit-mcqs/:mcqId", upload.single("image"), async (req, res) => {
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

    if (req.file) {
      mcqToUpdate.image = req.file.filename;
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

app.post("/add-feedback/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, text, school, rating, feedbackCreatedAt } = req.body;
    if (!name || !text || !school || !rating) {
      return res.status(400).json({
        error: true,
        message: "Name, text, school, and rating are required fields.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }

    user.feedbacks.push({ name, text, school, rating, feedbackCreatedAt });
    await user.save();

    res.status(201).json({
      status: "success",
      success: true,
      message: "Feedback added successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while adding feedback.",
      errorMessage: error.message,
    });
  }
});

app.get("/feedbacks", async (req, res) => {
  try {
    const usersWithFeedbacks = await User.find({ feedbacks: { $exists: true, $ne: [] } }, { _id: 1, feedbacks: 1 });
    const lastFeedbacksByUser = await Promise.all(
      usersWithFeedbacks.map(async (user) => {
        const userDetails = await User.findById(user._id, {
          firstName: 1,
          email: 1,
        });
        const lastFeedbackIndex = user.feedbacks.length - 1;
        const lastFeedback = user.feedbacks[lastFeedbackIndex];
        return {
          userId: user._id,
          email: userDetails.email,
          lastFeedback,
        };
      })
    );
    if (lastFeedbacksByUser.length === 0) {
      return res.status(200).json({
        status: "success",
        success: true,
        message: "No feedbacks found.",
        data: [],
      });
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "Last added feedbacks retrieved successfully",
      data: lastFeedbacksByUser,
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



app.delete("/feedback/:feedbackId", async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const user = await User.findOne({ "feedbacks._id": feedbackId });
    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "Feedback not found." });
    }
    const feedbackIndex = user.feedbacks.findIndex(
      (feedback) => feedback._id == feedbackId
    );
    if (feedbackIndex === -1) {
      return res
        .status(404)
        .json({ error: true, message: "Feedback not found." });
    }
    user.feedbacks.splice(feedbackIndex, 1);
    await user.save();
    res.status(200).json({
      status: "success",
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while deleting feedback.",
      errorMessage: error.message,
    });
  }
});

app.put("/edit-feedback/:feedbackId", async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { name, text, rating, school } = req.body;
    if (!name || !text || !rating || !school) {
      return res.status(400).json({
        error: true,
        message: "Name, text, rating, and school are required fields.",
      });
    }
    const user = await User.findOneAndUpdate(
      { "feedbacks._id": feedbackId },
      {
        $set: {
          "feedbacks.$.name": name,
          "feedbacks.$.text": text,
          "feedbacks.$.rating": rating,
          "feedbacks.$.school": school,
        },
      },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "Feedback not found." });
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "Feedback updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while updating feedback.",
      errorMessage: error.message,
    });
  }
});

app.get("/feedback/:feedbackId", async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const user = await User.findOne({ "feedbacks._id": feedbackId });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }
    const feedback = user.feedbacks.find(
      (feedback) => feedback._id.toString() === feedbackId
    );
    if (!feedback) {
      return res
        .status(404)
        .json({ error: true, message: "Feedback not found." });
    }

    res.status(200).json({
      status: "success",
      success: true,
      message: "Feedback retrieved successfully.",
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error while retrieving feedback.",
      errorMessage: error.message,
    });
  }
});

// Define a route to fetch feedbacks for certain users
app.get("/user-feedbacks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
        const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }
    const feedbacks = user.feedbacks;
    res.status(200).json({
      status: "success",
      success: true,
      message: "Feedbacks retrieved successfully",
      data: feedbacks,
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

// Define a route to fetch all feedbacks of every user
app.get("/all-feedbacks", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Array to store all feedbacks
    const allFeedbacks = [];

    // Iterate over each user
    for (const user of users) {
      // Extract user details
      const userDetails = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      // Iterate over each feedback of the user
      for (const feedback of user.feedbacks) {
        // Construct feedback object including user details
        const feedbackData = {
          ...userDetails,
          feedbackId: feedback._id,
          name: feedback.name,
          text: feedback.text,
          school: feedback.school,
          rating: feedback.rating,
          feedbackCreatedAt: feedback.feedbackCreatedAt,
        };

        // Push feedback data to allFeedbacks array
        allFeedbacks.push(feedbackData);
      }
    }

    // Return the feedbacks as a response
    res.status(200).json({
      status: "success",
      success: true,
      message: "All feedbacks retrieved successfully",
      data: allFeedbacks,
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
