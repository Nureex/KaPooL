const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  ride_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rides', required: true },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  reviewee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true }); // Adding timestamps option to automatically add createdAt and updatedAt fields


module.exports = mongoose.model('reviews', reviewSchema);
