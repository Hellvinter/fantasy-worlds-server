const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 2,
    max: 45
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    max: 100
  },
  password: {
    type: String,
    required: true,
    trim: true,
    max: 100,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
