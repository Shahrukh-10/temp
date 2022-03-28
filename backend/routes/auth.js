const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
require("dotenv").config();
var secret = process.env.JWT_SECRET;

// Create User don't require authentication
router.post(
  "/createuser",
  [
    body("name", "Name length not valid (>5)").isLength({ min: 5 }),
    body("email", "Email not valid").isEmail(),
    body("password", "Password should be greater than five").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }
    try {
      // Check wether user already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res
          .status(400)
          .json({ error: "Sorry user with this email already exist :( ." });
      }
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error ");
    }
  }
);

//  Authenticate User
router.post(
  "/login",
  [
    body("email", "Email not valid").isEmail(),
    body("password", "Password cannot be blank").exists({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res
          .status(400)
          .json({ error: "Please login with correct credentials." });
      }
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        res
          .status(400)
          .send({ error: "Please login with correct credentials." });
      }
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal sever error ");
    }
  }
);

// Get logged in user detail
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    let userId;
    const user = await User.findById(userId).select("-password");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
