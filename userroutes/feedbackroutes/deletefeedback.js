const deleteFeedback = async (User, req, res) => {
    try {
      const { feedbackId } = req.params;
        const user = await User.findOne({ "feedbacks._id": feedbackId });
        if (!user) {
        return res.status(404).json({ error: true, message: "User not found." });
      }
        const feedbackIndex = user.feedbacks.findIndex(feedback => feedback._id.toString() === feedbackId);
        if (feedbackIndex === -1) {
        return res.status(404).json({ error: true, message: "Feedback not found." });
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
  };
  
  module.exports = { deleteFeedback };
  