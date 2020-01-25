const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTRATION.
router.post("/registration", async (req, res) => {
  // Check that username already in database.
  const userNameExist = await User.findOne({ username: req.body.username });
  if (userNameExist) return res.status(400).send("Username already in use");

  // Check that email already in database.
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");
  console.log(emailExist);

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
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // Check that username exis.
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username is not found");

  // Password is correct?
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
