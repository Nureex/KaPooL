const Review = require('../models/Review');

// Create a new review
const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a review by ID
const getReviews = async (req, res) => {
  try {
    const review = await Review.find()
      .populate('ride_id reviewer_id reviewee_id');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('ride_id reviewer_id reviewee_id');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a specific user (reviewee)
const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee_id: req.params.userId })
      .populate('reviewer_id ride_id');
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews written by a specific user (reviewer)
const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer_id: req.params.userId })
      .populate('reviewee_id ride_id');
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    createReview,
    getReviewById,
    getReviewsForUser,
    getReviewsByUser,
    updateReview,
    deleteReview,
    getReviews
}