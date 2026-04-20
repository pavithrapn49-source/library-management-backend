import Review from "../models/Review.js";

// Add review
export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews for a book
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews written by logged-in user
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("book", "title author");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
