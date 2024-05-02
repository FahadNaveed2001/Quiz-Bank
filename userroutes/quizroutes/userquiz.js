const getUserQuizzes = async (User, req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate({
        path: "attemptedQuizzes.questions.questionId",
        model: "Q/A-MCQ",
      });
  
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found."});
      }
      const attemptedQuizzes = user.attemptedQuizzes;
      if (attemptedQuizzes.length === 0) {
        return res.status(200).json({
          status: "success",
          success: true,
          message: "User has not attempted any quiz",
        });
      }
      res.status(200).json({
        status: "success",
        success: true,
        message: "Attempted quizzes retrieved successfully",
        data: attemptedQuizzes,
      });
      console.log("Attempted quizzes retrieved successfully");
      console.log(attemptedQuizzes);
    } catch (error) {
      res.status(500).json({ error: true, message: "Error retrieving attempted quizzes of user", errorMessage: error.message });
      console.log("Error retrieving attempted quizzes of user");
      console.error(error);
    }
  };
  
  module.exports = { getUserQuizzes };
  