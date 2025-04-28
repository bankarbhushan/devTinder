const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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
    res.status(400).json({ error: err.message });
    // json becouse we have to show the error in the post man
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT(); // ✅ await added here

    // SET cookie here!
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 86400000), // 1 day
    });

    console.log("Cookies:", req.cookies);
    console.log("Token:", token);

    res.send("Login successful");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("user logout Successfull");
});

module.exports = authRouter;
