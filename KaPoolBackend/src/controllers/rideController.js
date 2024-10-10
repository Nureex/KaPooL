const Ride = require('../models/Ride');

// Create a new ride
const createRide = async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRides = async (req, res) => {
  try {
    const ride = await Ride.find()
    .populate('driver_id user_id')
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get ride by ID
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver_id user_id');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActiveRides = async (req, res) => {
  try {
    const activeRides = await Ride.find({
      ride_status: { $nin: ['completed', 'canceled'] }, // Exclude 'completed' and 'canceled'
      driver_id: req.params.driverId
    });

    return res.status(200).json(activeRides);
  } catch (error) {
    console.error('Error fetching active rides:', error);
    return res.status(500).json({ message: 'An error occurred while fetching active rides.' });
  }
};


// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { ride_status, ride_time, fare_price, payment_status } = req.body;
    const updateData = { ride_status };

    if (ride_status === 'completed') {
      updateData.ride_time = ride_time;
      updateData.fare_price = fare_price;
      updateData.payment_status = payment_status;
    }

    const ride = await Ride.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rides for a driver
const getRidesByDriver = async (req, res) => {
  try {
    const rides = await Ride.find({ driver_id: req.params.driverId });
    res.json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rides for a user
const getRidesByUser = async (req, res) => {
  try {
    const rides = await Ride.find({ user_id: req.params.userId });
    res.json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a ride
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    createRide,
    getRideById,
    updateRideStatus,
    getRidesByDriver,
    getRidesByUser,
    deleteRide,
    getRides,
    getActiveRides
};