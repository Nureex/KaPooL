const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true },
  phone: { type: String, require: true, default: ''},
  user_type: { type: String, enum: ['driver', 'user'],  default: 'user' },
  password: { type: String, require: true },
  status: { type: Boolean, default: true },
  profile_image_url:  { type: String, default: '' },
  driver: {
    vehicle_make: String,
    vehicle_model: String,
    vehicle_license_plate: String,
    vehicle_color: String,
    license_number: String,
    rating: Number,
    is_available: Boolean
  },
  rating: { type: Number, default: 0 },
}, { timestamps: true }); // Adding timestamps option to automatically add createdAt and updatedAt fields

module.exports = mongoose.model('users', userSchema);
