import Review from "../models/Review.js";

/* ================= ADD REVIEW ================= */
export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET REVIEWS BY BOOK ================= */
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId
    }).populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET MY REVIEWS ================= */
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id
    }).populate("book", "title author");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE REVIEW ================= */
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE REVIEW ================= */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};