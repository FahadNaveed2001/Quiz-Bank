const NOTIFICATION = require("../models/notificationmodel");

const getNotifications = async (req, res) => {
  try {
    const notifications = await NOTIFICATION.find();
    res.status(200).json({
      status: "success",
      success: true,
      message: "Notification retrieved successfully",
      notifications: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch notifications",
    });
  }
};

module.exports = getNotifications;
