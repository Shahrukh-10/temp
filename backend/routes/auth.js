const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

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
      console.log(user);
      if (user) {
        res
          .status(400)
          .json({ error: "Sorry user with this email already exist :( ." });
      }
      const salt = await bcrypt.genSalt(10);
      const securePass =await bcrypt.hash(req.body.password,salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured . ");
    }
  }
);

//

module.exports = router;
