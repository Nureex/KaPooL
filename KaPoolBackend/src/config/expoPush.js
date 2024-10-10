const { Expo } = require('expo-server-sdk');
let expo = new Expo();

// Send Push Notification
const sendPushNotification = async (pushToken, message) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [{
    to: pushToken,
    sound: 'default',
    body: message.body,
    data: message.data || {}
  }];

  try {
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendPushNotification;
