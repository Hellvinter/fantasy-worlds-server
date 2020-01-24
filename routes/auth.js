const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
//const { check, validationResult } = require("express-validator");

// REGISTRATION.

// Validation condtitions of registration.
// const registrationCheck = [
//   check("username").isLength({ min: 2 }),
//   check("email").isEmail(),
//   check("password").isLength({ min: 6 })
// ];

// const query = User.find({ name: "Hellvinter" });
// console.log(query);

// User creation
router.post("/register", async (req, res) => {
  // Validation errors.
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ errors: errors.array() });
  // }

  // Hash passwords.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create New user object.
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
  // Success ? save user : throw error
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN

module.exports = router;
