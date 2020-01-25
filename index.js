const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const port = 4000;

// Import Routes.
const authRoute = require("./routes/auth");
const userDashboard = require("./routes/user_dashboard");

dotenv.config();

// Connect to DB/
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db!")
);

// Middlewares
app.use(express.json());
// Route Middlewares.
app.use("/api/user", authRoute);
app.use("/api/user", userDashboard);

// 2 lines below should delete them later it's just for checking things
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/user/register", (req, res) => res.send("Registration page!"));
app.get("/api/user/dashboard", (req, res) => res.send("Dashboard page!"));

app.listen(port, () => console.log(`Server up and running at port ${port}`));
