import User from "../models/user.js";
import jwt from "jsonwebtoken";

/* ================= TOKEN ================= */

const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    /* VALIDATION */

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    /* CHECK USER */

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    /* VALID ROLES */

    const validRoles = [
      "member",
      "librarian",
      "admin",
    ];

    const selectedRole =
      validRoles.includes(role)
        ? role
        : "member";

    /* CREATE USER */

    const newUser =
      await User.create({
        name,
        email,
        password,
        role: selectedRole,
      });

    res.status(201).json({
      message:
        "Registered successfully",

      token: generateToken(
        newUser._id
      ),

      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

/* ================= LOGIN ================= */

export const loginUser =
  async (req, res) => {
    try {

      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Email and password required",
          });
      }

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "Invalid credentials",
          });
      }

      const isMatch =
        await user.matchPassword(
          password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Invalid credentials",
          });
      }

      res.status(200).json({
        success: true,

        message:
          "Login successful",

        token:
          generateToken(
            user._id
          ),

        user: {
          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        },
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ================= PROFILE ================= */

export const getProfile =
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user._id
        ).select("-password");

      res.json(user);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ================= GET ALL USERS ================= */

export const getAllUsers =
  async (req, res) => {
    try {

      const users =
        await User.find().select(
          "-password"
        );

      res.status(200).json({
        success: true,
        users,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ================= DELETE USER ================= */

export const deleteUser =
  async (req, res) => {
    try {

      /* prevent self delete */

      if (
        req.user._id.toString() ===
        req.params.id
      ) {
        return res
          .status(400)
          .json({
            message:
              "You cannot delete yourself",
          });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,

        message:
          "User deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ================= UPDATE USER ROLE ================= */

export const updateUserRole =
  async (req, res) => {
    try {

      const { role } =
        req.body;

      if (
        ![
          "member",
          "librarian",
          "admin",
        ].includes(role)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid role",
          });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      user.role = role;

      await user.save();

      res.json({
        success: true,

        message:
          "Role updated successfully",

        user,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };