const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Adminvalidation = (req, res, next) => {
  // console.log("admin authentication checked");
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
    // console.log("Cookies:", req.cookies); // Debug
    const { token } = req.cookies;

    if (!token || typeof token !== "string") {
      return res
        .status(401)
        .json({ error: "No valid token, authorization denied" });
    }

    const decoded = jwt.verify(token, "Abc@xyz@123");

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  Adminvalidation,
  UserValidation,
  userAuth,
};
