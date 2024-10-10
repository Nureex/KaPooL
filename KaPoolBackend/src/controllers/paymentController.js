require('dotenv').config();
const express = require('express');
const Payment = require('../models/Payment');
const axios = require('axios');
const Ride = require('../models/Ride');
const router = express.Router();

const PAYSTACK_SECRET_KEY = 'sk_test_5e60c09e2f76e12ff810bcae66bff147369b4077';

// Create a payment
const createPayment = async (req, res) => {
  const { reference, ride_id } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Reference is required' });
  }

  try {
    // Verify payment with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    const { status, data } = response;

    if (status === 200 && data.status === true) {
      const paymentDetails = data.data;

      const paymentData = {
        transaction_id: paymentDetails.reference,
        amount: paymentDetails.amount / 100, // Convert from kobo to Naira
        status: 'paid',
        email: paymentDetails.customer.email,
        ride_id: ride_id,
      };

      // Save payment
      const payment = new Payment(paymentData);
      await payment.save();

      const ride = await Ride.findById(ride_id);
      ride.payment_status = 'paid';
      await ride.save();

      return res.status(200).json({
        message: 'Payment verified and saved successfully',
        payment: paymentData,
      });
    } else {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a payment by ID
const getPayments = async (req, res) => {
  try {
    const payment = await Payment.find().populate('ride_id');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a payment by ID
const getPaymentsByUser = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('ride_id');;
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentByRideId = async (req, res) => {
  const { id: rideId } = req.params;

  try {
    // Find the ride by its ID
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Assuming the payment reference is correctly stored in the ride object
    const paymentReference = `ride-${ride._id}`;

    // Verify payment status with Paystack (replace with your payment service if needed)
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${paymentReference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,  // Use your Paystack secret key
      },
    });

    const paymentData = response.data.data;

    if (paymentData.status === 'success') {
      // Update ride payment status to 'paid'
      if (ride.payment_status !== 'paid') {
        ride.payment_status = 'paid';
        await ride.save();  // Save the updated ride
      }

      return res.status(200).json({ message: 'Payment verified', paymentStatus: 'paid' });
    } else {
      // Payment is not yet successful
      return res.status(200).json({ message: 'Payment not yet made', paymentStatus: 'pending' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



module.exports = {
    createPayment,
    getPaymentById,
    getPayments,
    getPaymentsByUser,
    getPaymentByRideId
}
