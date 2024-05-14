const getFeedbacks = async (User, req, res) => {
    try {
      const usersWithFeedbacks = await User.find({ feedbacks: { $exists: true, $ne: [] } }, { _id: 1, feedbacks: 1 });
        const lastFeedbacksByUser = await Promise.all(
        usersWithFeedbacks.map(async (user) => {
          const userDetails = await User.findById(user._id, { firstName: 1, email: 1 });
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
  };
  
  module.exports = { getFeedbacks };
  