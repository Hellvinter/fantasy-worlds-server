const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import Routes.
const authRoute = require("./routes/auth");

dotenv.config();

// Connect to DB/
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db!")
);

// Middlewares
app.use(express.json());
// Route Middlewares.
app.use("/api/user", authRoute);

// 2 lines below should delete them later it's just for checking things
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/user/register", (req, res) => res.send("Registration page!"));

app.listen(4000, () => console.log("Server up and running"));
