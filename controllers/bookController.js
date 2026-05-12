import Book from "../models/book.js";
import Borrow from "../models/Borrow.js";

/* ================= HELPER ================= */

const getBookStatus = (book, borrows) => {
  const hasReserved = borrows.some(
    (b) => b.status === "reserved"
  );

  if (hasReserved) {
    return "reserved";
  }

  if (book.availableCopies <= 0) {
    return "borrowed";
  }

  return "available";
};

/* ================= GET ALL BOOKS ================= */

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("reservedBy", "name email")
      .populate(
        "reservationQueue",
        "name email"
      )
      .sort({ createdAt: -1 });

    const borrows = await Borrow.find({
      status: {
        $in: ["borrowed", "reserved"],
      },
    });

    const updatedBooks = books.map((book) => {
      const relatedBorrows =
        borrows.filter(
          (b) =>
            b.book.toString() ===
            book._id.toString()
        );

      return {
        ...book.toObject(),

        status: getBookStatus(
          book,
          relatedBorrows
        ),

        queueLength:
          book.reservationQueue.length,
      };
    });

    res.status(200).json({
      success: true,
      count: updatedBooks.length,
      books: updatedBooks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE BOOK ================= */

export const getBookById = async (
  req,
  res
) => {
  try {
    const book = await Book.findById(
      req.params.id
    )
      .populate(
        "reservedBy",
        "name email"
      )
      .populate(
        "reservationQueue",
        "name email"
      );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const borrows = await Borrow.find({
      book: book._id,
      status: {
        $in: ["borrowed", "reserved"],
      },
    });

    const status = getBookStatus(
      book,
      borrows
    );

    res.status(200).json({
      success: true,

      book: {
        ...book.toObject(),
        status,

        queueLength:
          book.reservationQueue.length,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD BOOK ================= */

export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      description,
      isbn,
      price,
      totalCopies,
    } = req.body;

    const copies =
      Number(totalCopies) || 1;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      isbn,
      price,

      coverImage: req.file
        ? req.file.path
        : "",

      totalCopies: copies,
      availableCopies: copies,
    });

    res.status(201).json({
      success: true,
      message:
        "Book added successfully",
      book,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE BOOK ================= */

export const updateBook = async (
  req,
  res
) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.coverImage =
        req.file.path;
    }

    const book =
      await Book.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated",
      book,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE BOOK ================= */

export const deleteBook = async (
  req,
  res
) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const activeBorrow =
      await Borrow.findOne({
        book: book._id,
        status: "borrowed",
      });

    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete borrowed book",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= JOIN QUEUE ================= */

export const joinReservationQueue =
  async (req, res) => {
    try {
      const book =
        await Book.findById(
          req.params.id
        );

      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      const userId = req.user.id;

      const alreadyQueued =
        book.reservationQueue.some(
          (id) =>
            id.toString() === userId
        );

      if (alreadyQueued) {
        return res.status(400).json({
          message:
            "Already in queue",
        });
      }

      /* AVAILABLE */

      if (
        book.availableCopies > 0
      ) {
        return res.status(400).json({
          message:
            "Book available. Borrow directly.",
        });
      }

      book.reservationQueue.push(
        userId
      );

      await book.save();

      res.status(200).json({
        success: true,
        message:
          "Added to reservation queue",

        queueLength:
          book.reservationQueue.length,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to join queue",
      });
    }
  };

/* ================= RESERVED FOR USER ================= */

export const getReservedForUser =
  async (req, res) => {
    try {
      const books = await Book.find({
        reservedBy: req.user.id,
      });

      res.status(200).json({
        success: true,
        books,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch reserved books",
      });
    }
  };

  /* ================= ADD REVIEW ================= */

export const addBookReview =
  async (req, res) => {
    try {

      const {
        rating,
        comment,
      } = req.body;

      const book =
        await Book.findById(
          req.params.id
        );

      if (!book) {
        return res
          .status(404)
          .json({
            message:
              "Book not found",
          });
      }

      /* already reviewed */

      const alreadyReviewed =
        book.reviews.find(
          (r) =>
            r.user.toString() ===
            req.user._id.toString()
        );

      if (alreadyReviewed) {
        return res
          .status(400)
          .json({
            message:
              "Already reviewed",
          });
      }

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      book.reviews.push(review);

      /* calculate average */

      book.numReviews =
        book.reviews.length;

      book.averageRating =
        book.reviews.reduce(
          (acc, item) =>
            item.rating + acc,
          0
        ) /
        book.reviews.length;

      await book.save();

      res.status(201).json({
        success: true,
        message:
          "Review added",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };