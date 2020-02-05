const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const sessionTest = require("express-session");

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
//app.use(cookieParser());
// Route Middlewares.
app.use("/api/user", authRoute);
app.use("/api/user", userDashboard);
// Just to test express-session later should delete this
app.use(
  sessionTest({
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
);

// 3 lines below should delete them later it's just for checking things
app.get("/", (req, res) => {
  res.cookie("Wouldn't tell ya", "Testing", {
    HttpOnly: true,
    maxAge: 90000000,
    path: "/"
  });
  res.send("Hello World!");
  console.log(req.sessionID);
});
app.get("/api/user/registration", (req, res) => res.send("Registration page"));
app.get("/api/user/login", (req, res) => res.send("Login page"));
app.get("/api/user/dashboard", (req, res) => res.send("Dashboard page!"));

app.listen(port, () => console.log(`Server up and running at port ${port}`));
