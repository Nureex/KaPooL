const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ride_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rides', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending', 'failed'], required: true },
  transaction_id: { type: String, required: true },
}, { timestamps: true }); // Adding timestamps option to automatically add createdAt and updatedAt fields


module.exports = mongoose.model('payments', paymentSchema);
