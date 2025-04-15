const express = require("express");
const connectDB = require("./src/config/Database");
const User = require("./src/models/User");
const { validateSignUpData } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();
const jwt = require("jsonwebtoken");
const { userAuth } = require("./src/middleware/Authentication");
// this is for the express
app.use(express.json());
// this is middlewaare
User.createIndexes();
// this is middleware of the token parsing
app.use(cookieParser());

// is a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads. When clients send data to your server in the form of JSON, this middleware is what enables your server to understand and process that data.
/*
req.body =={
          firstName: "bhushan",
          lastName: "bankar",
          email: "bhushan@gamil.com",
          password: "123",
          age: 12,
}
this json will come in the req.body
*/

app.post("/signup", async (req, res) => {
  try {
    // when the data is come form the body we will send to the validate function
    validateSignUpData(req);

    // now i have to encrypt the password
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully to the database");
  } catch (err) {
    // if (err.code === 11000) {
    //   res.send("Email already exists. Please use a different email.");
    // }

    res.status(400).json({ error: err.message });
    // json becouse we have to show the error in the post man
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // getting the data form the databse

    if (!user) {
      throw new Error("Invalid credential");
    }

    const isPasswordvalid = await user.validatePassword(password);

    if (isPasswordvalid) {
      const token = await user.getJWT();
      // we call the jwt function which is present int user model for the validation
      res.send("Login successful....");
    } else {
      throw new Error("Invalid Cedential");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.log("Error", err);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sending the connection request..... ");
});

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");
    app.listen(3002, () => console.log("Server running on port 3002"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
