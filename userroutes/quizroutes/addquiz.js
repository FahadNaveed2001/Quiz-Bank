const saveQuizzes = async (User, req, res) => {
    try {
      const { userId, attemptedQuizzes } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found."});
      }
      for (const quizData of attemptedQuizzes) {
        const { questions, totalScore, obtainedScore, usmleSteps, USMLE } =
          quizData;
        const newQuestions = questions.map((question) => {
          const { questionId, selectedOption } = question;
          return { questionId, selectedOption };
        });
        const newQuiz = {
          questions: newQuestions,
          totalScore,
          obtainedScore,
          usmleSteps,
          USMLE,
          createdAt: new Date(),
        };
        user.attemptedQuizzes.push(newQuiz);
      }
      await user.save();
      res.status(200).json({
        status: "success",
        success: true,
        message: "Quizzes saved successfully",
      });
      console.log("Quizzes saved successfully");
    } catch (error) {
      res.status(500).json({ error: true, message: "Error saving quizzes", errorMessage: error.message });
      console.log("Error saving quizzes");
      console.error(error);
    }
  };
  
  module.exports = { saveQuizzes };
  