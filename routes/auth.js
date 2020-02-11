const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
// Import some requirements for experiment.
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);

dotenv.config();

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
    await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Unique session cookies for experiment
const uniqueSession = session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    secret: process.env.STORE_SECRET,
    collection: "unique_session",
    touchAfter: 3600
  }),
  cookie: {
    domain: "http://localhost:3000/",
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 60 * 60 * 1000)
  }
});

// LOGIN
router.post("/login", uniqueSession, async (req, res) => {
  // Check that username exis.
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username is not found");

  // Password is correct?
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // Create and assign a token
  // To make cookies based authentication.
  // I should replase lines bellow
  // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
  //   expiresIn: "1h"
  // });
  // res.header("auth-token", token).send("Your cookies in the box");

  // Code below kinda works but it's doesn't create session cookie unfortunatly
  // Should solve this problem.
  // res.header don't do a thing
  // INSTEAD
  // use req.session
  try {
    // Session is working.
    // It's passed to DB.
    // Note: I can't manipulate session.id or sessionId
    // It's just don't create session if I try
    req.session;
    // With line below I should recognize each unique user.
    req.session.name = user._id;
    // Somehow should pass cookies across the app.
    res.cookie("unique_user", req.session.id, uniqueSession.cookie);
    console.log(req.session);
    //console.log(req.session.name);
    console.log(req.session.id);
    res.send("You are logged, check your cookies");
    res.end();
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
