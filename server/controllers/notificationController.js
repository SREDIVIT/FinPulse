import Notification from '../models/Notification.js';

// @desc Get all notifications
// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark notification as read or unread
// @route PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = req.body.read !== undefined ? req.body.read : true;
    const updated = await notification.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark all notifications as read
// @route PUT /api/notifications/mark-all-read
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete notification
// @route DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
