const User = require("../models/usermodel");

const getUserNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("notifications.notification");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "User's notifications retrieved successfully",
      notifications: user.notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch user's notifications",
      errorMessage: error.message,
    });
  }
};

module.exports = getUserNotifications;
