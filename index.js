const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);

const port = 4000;

// Import Routes.
const authRoute = require("./routes/auth");
// Route below do nothing for now
const userDashboard = require("./routes/user_dashboard");

dotenv.config();

// Connect to DB/
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db!")
);

//Session object
const userSession = session({
  name: "guest",
  secret: process.env.COOKIE_SECRET,
  resave: true,
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
});

// Middlewares
app.use(cors());
app.use(express.json());
// Route Middlewares.
app.use("/api/user", authRoute);
app.use("/api/user", userDashboard);

app.get("/", (req, res) => {
  // pass userSession as middleware
  // Third param it's session object without that cookies don't show up.
  // I shoud pass object(session).cookie.
  //res.cookie("user_session", req.session.id, userSession.cookie);
  if (req.session) {
    res.send("Hello User");
  }
  if (!req.session) {
    res.send("Hello World!");
  }
  //console.log(req.session.id);
});
app.get("/api/user/registration", (req, res) => res.send("Registration page"));
app.get("/api/user/login", (req, res) => {
  // I think to pass cookies I should make something here
  res.send("Login page");
});
app.get("/api/user/dashboard", (req, res) => res.send("Dashboard page!"));

app.listen(port, () => console.log(`Server up and running at port ${port}`));
