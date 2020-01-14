const router = require("express").Router();
const User = require("../models/User");
//const validation = require("../controller/validation");

router.post("/register", async (req, res) => {
  //validation.registrationCheck0
  //validation.registrationErrors();

  // User.create({
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password
  // }).then(user => res.json(user));

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
