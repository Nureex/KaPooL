const Notification = require('../models/Notification');
const Expo = require('expo-server-sdk').Expo;

// Create and send a notification (with Expo Push Notification integration)
const createNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    
    // Save the notification in the database
    const notification = new Notification({ user_id, message });
    await notification.save();
    
    // Send push notification (assuming Expo Push Token is available in User model)
    const user = await User.findById(user_id); // Assuming User schema has expo_push_token
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.expo_push_token) {
      let expo = new Expo();
      let messages = [];
      if (Expo.isExpoPushToken(user.expo_push_token)) {
        messages.push({
          to: user.expo_push_token,
          sound: 'default',
          body: message,
          data: { notificationId: notification._id },
        });
      }
      
      // Send the notification using Expo
      let ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log(ticketChunk);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('user_id');
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all notifications for a specific user
const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update notification status
const updateNotificationStatus = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete notification by ID
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    createNotification,
    getNotificationById,
    getNotificationsForUser,
    updateNotificationStatus,
    deleteNotification,
}