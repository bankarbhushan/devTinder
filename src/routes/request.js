const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/Authentication");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/User");

const mongoose = require("mongoose");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // console.log("From:", fromUserId);
      // console.log("To:", toUserId);
      // console.log("Status:", status);

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type: " + status });
      }

      const toConnectionUser = await User.findById(toUserId);
      if (!toConnectionUser) {
        return res.status(400).json({ message: "This user is not found" });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({
          message: `You already sent a connection request to ${toConnectionUser.firstName}.`,
        });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          status === "interested"
            ? `${req.user.firstName} is interested in ${toConnectionUser.firstName}.`
            : `${req.user.firstName} ignored ${toConnectionUser.firstName}.`,
        data,
      });
    } catch (err) {
      console.error("Error in /request/send:", err); // Log the full error
      res.status(400).json({ message: `Something went wrong: ${err.message}` });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status is not allowed",
        });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "No matching connection request found or already processed.",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        ErrorMessage: err.message,
      });
    }
  }
);

module.exports = requestRouter;

// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       const allowedStatus = ["ignored", "interested"];
//       if (!allowedStatus.includes(status)) {
//         return res
//           .status(400)
//           .json({ message: "Invalid status type: " + status });
//       }

//       const toUser = await User.findById(toUserId);
//       if (!toUser) {
//         return res.status(404).json({ message: "User not found!" });
//       }

//       const existingConnectionRequest = await ConnectionRequestSchema.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           { fromUserId: toUserId, toUserId: fromUserId },
//         ],
//       });
//       if (existingConnectionRequest) {
//         return res
//           .status(400)
//           .send({ message: "Connection Request Already Exists!!" });
//       }

//       const connectionRequest = new ConnectionRequestSchema({
//         fromUserId,
//         toUserId,
//         status,
//       });

//       const data = await connectionRequest.save();

//       res.json({
//         message:
//           req.user.firstName + " is " + status + " in " + toUser.firstName,
//         data,
//       });
//     } catch (err) {
//       res.status(400).send("ERROR: " + err.message);
//     }
//   }
// );

// requestRouter.post(
//   "/request/review/:status/:requestId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const loggedInUser = req.user;
//       const { status, requestId } = req.params;

//       const allowedStatus = ["accepted", "rejected"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({ messaage: "Status not allowed!" });
//       }

//       const connectionRequest = await ConnectionRequestSchema.findOne({
//         _id: requestId,
//         toUserId: loggedInUser._id,
//         status: "interested",
//       });
//       if (!connectionRequest) {
//         return res
//           .status(404)
//           .json({ message: "Connection request not found" });
//       }

//       connectionRequest.status = status;

//       const data = await connectionRequest.save();

//       res.json({ message: "Connection request " + status, data });
//     } catch (err) {
//       res.status(400).send("ERROR: " + err.message);
//     }
//   }
// );
