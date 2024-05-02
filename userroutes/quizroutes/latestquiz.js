const getLatestQuiz = async (User, req, res) => {
  try {
      const { userId } = req.params;

      const user = await User.findById(userId, {
          attemptedQuizzes: { $slice: -1 }, // Get only the latest attempted quiz
      }).populate({
          path: "attemptedQuizzes.questions.questionId",
          model: "Q/A-MCQ",
      });

      if (!user) {
          return res.status(404).json({ error: true, message: "User not found." });
      }

      if (user.attemptedQuizzes.length === 0) {
          return res.status(200).json({
              status: "success",
              success: true,
              message: "User has not attempted any quiz",
          });
      }

      const latestQuiz = user.attemptedQuizzes[0];

      res.status(200).json({
          status: "success",
          success: true,
          message: "Latest quiz retrieved successfully",
          data: latestQuiz,
      });

      console.log("Latest quiz retrieved successfully");
      console.log(latestQuiz);
  } catch (error) {
      res.status(500).json({ error: true, message: "Error retrieving latest quiz of user", errorMessage: error.message });
      console.log("Error retrieving latest quiz of user");
      console.error(error);
  }
};

module.exports = { getLatestQuiz };
