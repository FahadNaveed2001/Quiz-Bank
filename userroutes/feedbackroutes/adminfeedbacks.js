const getAllFeedbacks = async (User, req, res) => {
    try {
      const users = await User.find();
        const allFeedbacks = [];
        for (const user of users) {
        const userDetails = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
          for (const feedback of user.feedbacks) {
          const feedbackData = {
            ...userDetails,
            feedbackId: feedback._id,
            name: feedback.name,
            text: feedback.text,
            school: feedback.school,
            rating: feedback.rating,
            feedbackCreatedAt: feedback.feedbackCreatedAt,
          };
          allFeedbacks.push(feedbackData);
        }
      }
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
  };
  
  module.exports = { getAllFeedbacks };
  