const express = require("express");
const connectDB = require("./src/config/Database");
const cookieParser = require("cookie-parser");

const app = express();

// this is for the express
app.use(express.json());
// this is middleware of the token parsing
app.use(cookieParser());

const authRoute = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");

app.use("/", authRoute);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");
    app.listen(3002, () => console.log("Server running on port 3002"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
