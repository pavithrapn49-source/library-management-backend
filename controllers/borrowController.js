import Borrow from "../models/Borrow.js";
import Book from "../models/book.js";

/* ================= RESERVE BOOK ================= */

export const reserveBook = async (
  req,
  res
) => {
  try {

    const { bookId } =
      req.body;

    const book =
      await Book.findById(
        bookId
      );

    if (!book) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Book not found",
        });
    }

    /* already borrowed */

    const alreadyBorrowed =
      await Borrow.findOne({
        user: req.user._id,
        book: bookId,
        status: "borrowed",
      });

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "You already borrowed this book",
        });
    }

    /* already reserved */

    const existingReserve =
      await Borrow.findOne({
        user: req.user._id,
        book: bookId,
        status: "reserved",
      });

    if (existingReserve) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Already reserved",
        });
    }

    /* create reserve */

    const record =
      await Borrow.create({
        user: req.user._id,
        book: bookId,
        status: "reserved",
        reservedAt:
          new Date(),
      });

    /* add to queue */

    if (
      !book.reservationQueue.includes(
        req.user._id
      )
    ) {
      book.reservationQueue.push(
        req.user._id
      );
    }

    await book.save();

    res.status(200).json({
      success: true,
      message:
        "Book reserved successfully",
      record,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

/* ================= GET RESERVED ================= */

export const getMyReservedBooks =
  async (req, res) => {
    try {

      const records =
        await Borrow.find({
          user: req.user._id,
          status: "reserved",
        })
          .populate("book")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        records,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  };

/* ================= BORROW BOOK ================= */

export const borrowBook = async (
  req,
  res
) => {
  try {

    const { bookId } = req.body;

    const book =
      await Book.findById(
        bookId
      );

    if (!book) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Book not found",
        });
    }

    if (
      book.availableCopies <= 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Book not available",
        });
    }

    /* already borrowed */

    const alreadyBorrowed =
      await Borrow.findOne({
        user: req.user._id,
        book: bookId,
        status: "borrowed",
      });

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Already borrowed",
        });
    }

    /* CREATE BORROW RECORD */

    const borrow =
      await Borrow.create({
        user: req.user._id,
        book: bookId,

        status: "borrowed",

        borrowDate:
          new Date(),

        dueDate:
          new Date(
            Date.now() +
              7 *
                24 *
                60 *
                60 *
                1000
          ),
      });

    /* reduce copies */

    book.availableCopies -= 1;

    await book.save();

    res.json({
      success: true,
      message:
        "Book borrowed successfully",
      record: borrow,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

/* ================= RETURN BOOK ================= */

export const returnBook = async (
  req,
  res
) => {
  try {

    const { borrowId } =
      req.body;

    const borrow =
      await Borrow.findById(
        borrowId
      ).populate("book");

    if (!borrow) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Record not found",
        });
    }

    if (
      borrow.status ===
      "returned"
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Already returned",
        });
    }

    let fine = 0;

    const today =
      new Date();

    /* calculate fine */

    if (
      borrow.dueDate &&
      today >
        borrow.dueDate
    ) {

      const diffDays =
        Math.ceil(
          (today -
            borrow.dueDate) /
            (1000 *
              60 *
              60 *
              24)
        );

      fine =
        diffDays * 10;
    }

    /* update borrow */

    borrow.status =
      "returned";

    borrow.returnDate =
      today;

    borrow.fine = fine;

    await borrow.save();

    /* update book */

    const book =
      await Book.findById(
        borrow.book._id
      );

    book.availableCopies += 1;

    /* queue system */

    if (
      book.reservationQueue
        .length > 0
    ) {

      const nextUser =
        book
          .reservationQueue[0];

      book.reservedBy =
        nextUser;

    } else {

      book.reservedBy =
        null;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message:
        "Book returned successfully",
      fine,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message:
        err.message,
    });

  }
};

/* ================= GET BORROWED ================= */

export const getMyBorrowedBooks =
  async (req, res) => {
    try {

      const records =
        await Borrow.find({
          user: req.user._id,
          status:
            "borrowed",
        })
          .populate("book")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        records,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  };

/* ================= GET RETURNED ================= */

export const getMyReturnedBooks =
  async (req, res) => {
    try {

      const records =
        await Borrow.find({
          user: req.user._id,
          status:
            "returned",
        })
          .populate("book")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        records,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  };

/* ================= FULL HISTORY ================= */

export const getMyHistory =
  async (req, res) => {
    try {

      const records =
        await Borrow.find({
          user: req.user._id,
        })
          .populate("book")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        records,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  };

/* ================= ADMIN ALL TRANSACTIONS ================= */

export const getAllTransactions =
  async (req, res) => {
    try {

      const records =
        await Borrow.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "book",
            "title author"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        records,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  };