const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref is basically connect the 2 database becouse we have to fetch the data from that databse as well
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{values} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

ConnectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error("You cannot send a connection request to yourself"));
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "connectionrequestmodels",
  ConnectionRequestSchema
);

module.exports = connectionRequestModel;
