const deleteQuiz = async (User, req, res) => {
    try {
      const { userId, quizId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found."});
        
      }
      const quizIndex = user.attemptedQuizzes.findIndex(
        (quiz) => quiz._id.toString() === quizId
      );
      if (quizIndex === -1) {
        return res.status(404).json({ error: true, message: "Quiz not found for the user."});
      }
      user.attemptedQuizzes.splice(quizIndex, 1);
      await user.save();
      res.status(200).json({
        status: "success",
        success: true,
        message: "Quizzes deleted successfully",
      });
      console.log("Quiz deleted successfully");
    } catch (error) {
      res.status(500).json({ error: true, message: "Error deleting quiz", errorMessage: error.message });
      console.log("Error deleting quiz");
      console.error(error);
    }
  };
  
  module.exports = {
    deleteQuiz,
  };
  