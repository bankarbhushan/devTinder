const express = require("express");
const connectDB = require("./Utils/Database");
const User = require("./models/User");
const app = express();

app.post("/signup", (req, res) => {
  const user = new User({
    firstName: "bhushan",
    lastName: "bankar",
    email: "bhushan@gamil.com",
    password: "123",
    age: 12,
  });
  try {
    user.save();
    res.send("user added successfully in the database");
  } catch (err) {
    console.log("Invalid request");
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");

    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
