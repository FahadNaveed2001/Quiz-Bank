const NOTIFICATION = require("../models/notificationmodel");
const User = require("../models/usermodel");

const addNotification = async (req, res) => {
  const { notificationTitle, notificationBody } = req.body;
  if (!notificationTitle || !notificationBody) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "All fields are required",
    });
  }
  try {
    const newNotification = new NOTIFICATION({ notificationTitle, notificationBody });
    const savedNotification = await newNotification.save();
    const users = await User.find({});
    const userIds = users.map((user) => user._id);

    savedNotification.users = userIds;
    await savedNotification.save();

    await User.updateMany({}, { $push: { notifications: { notification: savedNotification._id } } });

    res.status(200).json({
      status: "success",
      success: true,
      message: "Notification added successfully",
      savedNotification: savedNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to save notification",
      errorMessage: error.message,
    });
  }
};

module.exports = addNotification;
