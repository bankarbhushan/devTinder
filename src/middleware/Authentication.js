const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Adminvalidation = (req, res, next) => {
  console.log("admin authentication checked");
  const token = "xyz";
  const isAdminAuthoried = token === "xyz";
  if (isAdminAuthoried) {
    next();
  } else {
    res.status(401).send("Invalid Admin Authentication");
  }
};

const UserValidation = (req, res, next) => {
  const token = "abc";
  const isUserAuthoried = token === "abc";
  if (isUserAuthoried) {
    next();
  } else {
    res.status(401).send("Invalid User Authentication ");
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token....");
    }

    const isValidUser = await jwt.verify(token, "Abc@xyz@123");

    const { _id } = isValidUser;
    console.log(_id);

    const user = await User.findById({ _id });

    // finding the user in the database
    if (!user) {
      throw new Error("user not found ");
    }
    req.user = user;
    // attaching the user information with the req so in the profile user can easily find
    // Using the use = req.user

    next();
  } catch (err) {
    console.log("Eroor:", err);
  }
};
module.exports = {
  Adminvalidation,
  UserValidation,
  userAuth,
};
