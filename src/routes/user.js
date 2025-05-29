const express = require("express");
const { userAuth } = require("../middleware/Authentication");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/User");
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
    // console.log(connectionRequests);

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

// I Will find those user and hide them whom i send the request and received the request
// also i will not show myself as well

userRoute.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  // we will not allowed greater than 50
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const connectionRequest = await connectionRequestModel
    .find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    })
    .select("fromUserId toUserId");
  // .populate("fromUserId", "firstName")
  // .populate("toUserId", "firstName");

  // creating the list of hidfe user those are unique
  const hideUserFromFeed = new Set();
  connectionRequest.forEach((req) => {
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
  });

  // i will find other user which is not in the set mean that user i dont want to hide them
  // this will give the whole user excluding the connection

  const user = await User.find({
    // we will convert the set into array
    _id: { $nin: Array.from(hideUserFromFeed) },
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  res.json({ data: user });
});
module.exports = userRoute;
