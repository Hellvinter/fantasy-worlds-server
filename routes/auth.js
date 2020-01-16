const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// REGISTRATION.

// Validation condtitions of registration.
// Use body for validata only req.body
// For cookies|header|params|query|body use check
const registrationCheck = [
  body("username").isLength({ min: 2 }),
  body("email")
    .isEmail()
    .custom(req => {
      return findUserByEmail(req).then(user => {
        if (user) {
          throw new Error("Email already in use");
        }
      });
    }),
  body("password").isLength({ min: 6 })
];

// Custom validator doesn't works yet
const findUserByEmail = (email, callback) => {
  let query = User.findOne({ email: req.body.email });
  if (query === email) {
    return true;
  } else return false;
};

// User creation
router.post("/register", registrationCheck, async (req, res) => {
  // Validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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
