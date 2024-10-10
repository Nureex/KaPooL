const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const rideController = require('../controllers/rideController');
const driverController = require('../controllers/driverController');
const paymentController = require('../controllers/paymentController');
const reviewController = require('../controllers/reviewController');
const notificationController = require('../controllers/notificationController');


// Define routes for your collection
// Example:

// User routes
router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);
router.get('/users/:userId', userController.getUserById);

// Rides routes
router.post('/rides', rideController.createRide);
// Get a specific ride
router.get('/rides/:id', rideController.getRideById);
router.get('/rides', rideController.getRides);
router.get('/rides/:driverId/active', rideController.getActiveRides);
// Update a ride's status
router.put('/rides/:id/status', rideController.updateRideStatus);
// Get all rides for a driver
router.get('/drivers/:driverId/rides', rideController.getRidesByDriver);
// Get all rides for a user
router.get('/users/:userId/rides', rideController.getRidesByUser);
// Delete a ride
router.delete('/rides/:id', rideController.deleteRide);


// Driver routes
router.post('/drivers', driverController.createDriver);
router.get('/drivers/:id', driverController.getDriverById);
router.get('/drivers/:driver_id/vehicle', driverController.getDriverByDriverId);
router.get('/drivers', driverController.getDrivers);
router.put('/drivers/:id', driverController.updateDriver);
router.put('/drivers/:driver_id/vehicle', driverController.updateDriverByDriverId);
router.put('/drivers/:driver_id/location', driverController.updateDriverLocation);
router.put('/drivers/:id/availability', driverController.updateDriverAvailability);
router.get('/drivers/available', driverController.getAvailableDrivers);
router.delete('/drivers/:id', driverController.deleteDriver);

// Payment routes
router.post('/payments', paymentController.createPayment);
router.get('/payments', paymentController.getPayments);
router.get('/payments/:id', paymentController.getPaymentByRideId);
router.get('/payments/:id/user', paymentController.getPaymentsByUser);

// Review routes
router.post('/reviews', reviewController.createReview);
router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.get('/reviews/:userId/user', reviewController.getReviewsByUser);
router.get('/reviews/:userId/driver', reviewController.getReviewsForUser);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

// Notification routes
router.post('/notifications', notificationController.createNotification);
router.get('/notifications/:id', notificationController.getNotificationById);
router.get('/notifications/:userId', notificationController.getNotificationsForUser);
router.put('/notifications/:id/status', notificationController.updateNotificationStatus);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;