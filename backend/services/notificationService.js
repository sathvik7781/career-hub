const Notification = require("../models/Notification");
const AppError = require("../utils/appError");

exports.createNotification = async (recipientId, type, title, message, link) => {
  return await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    link,
  });
};

exports.getNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

exports.markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new AppError("Notification not found", 404);
  return notification;
};

exports.markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};
