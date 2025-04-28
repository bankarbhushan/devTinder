const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/Authentication");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sending the connection request..... ");
});

module.exports = requestRouter;
