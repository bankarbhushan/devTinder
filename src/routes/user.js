const express = require("express");
const { userAuth } = require("../middleware/Authentication");
const connectionRequestModel = require("../models/connectionRequest");
const userRoute = express.Router();

const USER_SAFE_DATA = "firstName lastName about skills age gender photoUrl";
userRoute.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "data fetch successfully...",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// we will find the coonection which i accepted
// count of Friends
// bhushan => ram , shyam count = 2
// ram => bhushan = count 1

userRoute.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json(data);
  } catch (err) {
    console.error("Error in /user/connection:", err);
    res.status(400).json({ message: "Something went wrong in connection" });
  }
});

module.exports = userRoute;
