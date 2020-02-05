const router = require("express").Router();
const User = require("../models/user");
//const jwt = require("jsonwebtoken");
const session = require("express-session");
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
    await user.save();
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

  // Create and assign a token
  // To make cookies based authentication.
  // I should replase lines bellow
  // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
  //   expiresIn: "1h"
  // });
  // res.header("auth-token", token).send("Your cookies in the box");

  // Code below kinda works but it's doesn't create session cookie unfortunatly
  // Should solve this problem
  try {
    await res
      .header(
        session({
          name: "user.session",
          secret: process.env.COOKIE_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secret: process.env.COOKIE_SECRET,
            domain: "http://localhost:3000/",
            httpOnly: true,
            path: "/",
            expires: new Date(Date.now() + 60 * 60 * 1000)
          }
        })
      )
      .send("Cookies in the jar");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
