const express = require("express");
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// this will help to get back you the cookies on the frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    // from here we will set the URL of the frontend to get the cookies
    credentials: true,
  })
);

// this is for the express
app.use(express.json());
// this is middleware of the token parsing
app.use(cookieParser());

const authRoute = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRoute = require("./routes/user");

app.use("/", authRoute);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRoute);

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");
    app.listen(3002, () => console.log("Server running on port 3002"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
