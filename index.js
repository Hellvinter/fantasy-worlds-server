const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const route = require("express").Router();

const port = 4000;

// Import Routes.
const authRoute = require("./routes/auth");
const userDashboard = require("./routes/user_dashboard");

dotenv.config();

// Connect to DB/
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db!")
);
// Middlewares
app.use(cors());
app.use(express.json());
// Route Middlewares.
app.use("/api/user", authRoute);
app.use("/api/user", userDashboard);
// Just to test express-session later should delete this
app.use(
  session({
    name: "user_session",
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      secret: process.env.STORE_SECRET,
      collection: "session",
      touchAfter: 3600
    }),
    cookie: {
      domain: "http://localhost:3000/",
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000)
    }
  })
);

app.get("/", (req, res) => {
  req.sessionID;
  // res.cookie just for checking things. Delete it later
  // res.cookie("Wouldn't tell ya", "Testing", {
  //   HttpOnly: true,
  //   maxAge: 90000000,
  //   path: "/"
  // });
  res.send("Hello World!");
  console.log(req.sessionID);
});
app.get("/api/user/registration", (req, res) => res.send("Registration page"));
app.get("/api/user/login", (req, res) => res.send("Login page"));
app.get("/api/user/dashboard", (req, res) => res.send("Dashboard page!"));

app.listen(port, () => console.log(`Server up and running at port ${port}`));
