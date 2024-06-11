const NOTIFICATION = require("../models/notificationmodel");
const User = require("../models/usermodel");


const deleteUserNotification = async (req, res) => {
  const { userId, notificationId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }
    user.notifications.pull(notificationId);
    await user.save();
    await NOTIFICATION.findByIdAndUpdate(notificationId, {
      $pull: { users: userId },
    });
    res.status(200).json({
      status: "success",
      success: true,
      message: "Notification removed from user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to remove notification from user",
    });
  }
};

module.exports = deleteUserNotification;
