const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  origin_address: { type: String, required: true },
  destination_address: { type: String, required: true },
  origin_latitude: { type: Number, required: true },
  origin_longitude: { type: Number, required: true },
  destination_latitude: { type: Number, required: true },
  destination_longitude: { type: Number, required: true },
  ride_time: { type: Number, required: true },
  ride_status: { type: String, enum: ['requested', 'accepted', 'arrived', 'in_progress', 'completed', 'canceled'], required: true, default: 'requested' },
  fare_price: { 
    type: Number, 
    required: true,
    min: 0
  },
  payment_status: { type: String, required: true },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('rides', rideSchema);
