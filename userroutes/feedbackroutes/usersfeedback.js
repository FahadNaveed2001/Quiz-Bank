const getUserFeedbacks = async (User, req, res) => {
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
  };
  
  module.exports = { getUserFeedbacks };
  