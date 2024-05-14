const editFeedback = async (User, req, res) => {
    try {
      const { feedbackId } = req.params;
      const { name, text, rating, school } = req.body;
        if (!name || !text || !rating || !school) {
        return res.status(400).json({
          error: true,
          message: "Name, text, rating, and school are required fields.",
        });
      }
        const user = await User.findOneAndUpdate(
        { "feedbacks._id": feedbackId },
        {
          $set: {
            "feedbacks.$.name": name,
            "feedbacks.$.text": text,
            "feedbacks.$.rating": rating,
            "feedbacks.$.school": school,
            "feedbacks.$.feedbackCreatedAt": new Date(), 

          },
        },
        { new: true }
      );
        if (!user) {
        return res.status(404).json({ error: true, message: "Feedback not found." });
      }
        res.status(200).json({
        status: "success",
        success: true,
        message: "Feedback updated successfully.",
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error while updating feedback.",
        errorMessage: error.message,
      });
    }
  };
  
  module.exports = { editFeedback };
  