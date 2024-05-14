const addFeedback = async (User, req, res) => {
    try {
      const { userId } = req.params;
      const { name, text, school, rating, feedbackCreatedAt } = req.body;
        if (!name || !text || !school || !rating ) {
        return res.status(400).json({
          error: true,
          message: "Name, text, school, rating, and feedbackCreatedAt are required fields.",
        });
      }
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: true, message: "User not found." });
      }
        if (user.feedbacks.length > 0) {
        return res.status(400).json({
          error: true,
          message: "User has already created one feedback and cannot create another.",
        });
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
  };
  
  module.exports = { addFeedback };
  