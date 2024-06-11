const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificationTitle: {
    type: String,
    required: true,
  },
  notificationBody: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Q/A-User",
    },
  ],
});

const NOTIFICATION = mongoose.model("Q/A-notifications", notificationSchema);

module.exports = NOTIFICATION;
