const NOTIFICATION = require("../models/notificationmodel");
const User = require("../models/usermodel");



const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await NOTIFICATION.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Notification not found",
      });
    }

    await User.updateMany(
      { 'notifications.notification': notificationId },
      { $pull: { notifications: { notification: notificationId } } }
    );

    await NOTIFICATION.deleteOne({ _id: notificationId });

    res.status(200).json({
      status: "success",
      success: true,
      message: "Notification deleted for all users",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to delete notification",
      errorMessage: error.message,
    });
  }
};

module.exports = deleteNotification;
