const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  vehicle_make: String,
  vehicle_model: String,
  vehicle_license_plate: String,
  vehicle_color: String,
  license_number: String,
  vehicle_seats: { type: Number, default: 4 },
  rating: { type: Number, default: 0 },
  latitude: Number,
  longitude: Number,
  cost_per_minute: { type: Number, required: true },
  cost_per_kilometer: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
}, { timestamps: true }); // Adding timestamps option to automatically add createdAt and updatedAt fields

module.exports = mongoose.model('drivers', driverSchema);
