const User = require("../models/usermodel");

const updateUserNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    user.notifications.forEach((notification) => {
      notification.isViewed = true;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "All notifications for the user updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to update notifications",
      errorMessage: error.message,
    });
  }
};

module.exports = updateUserNotifications;
