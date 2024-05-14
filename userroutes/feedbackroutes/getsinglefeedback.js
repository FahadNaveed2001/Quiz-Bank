const getFeedbackById = async (User, req, res) => {
    try {
      const { feedbackId } = req.params;
        const user = await User.findOne({ "feedbacks._id": feedbackId });
        if (!user) {
        return res.status(404).json({ error: true, message: "User not found." });
      }
        const feedback = user.feedbacks.find(feedback => feedback._id.toString() === feedbackId);
        if (!feedback) {
        return res.status(404).json({ error: true, message: "Feedback not found." });
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
  };
  
  module.exports = { getFeedbackById };
  