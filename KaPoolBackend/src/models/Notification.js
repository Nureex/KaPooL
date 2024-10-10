const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
}, { timestamps: true }); // Adding timestamps option to automatically add createdAt and updatedAt fields


module.exports = mongoose.model('notifications', notificationSchema);
