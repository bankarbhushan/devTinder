const express = require("express");
const { userAuth } = require("../middleware/Authentication");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constant");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;

    console.log(membershipType);

    const { firstName, lastName, email } = req.user;

    const order = await {
      orderId: "217287uuhkfdjsah789",
      amount: membershipAmount[membershipType] * 10,
      currency: "INR",
      receipt: "receipt#1",
      status: "created",
      receipt: "a6354fdhkajfhk",
      notes: {
        firstName: firstName,
        lastName: lastName,
        membershipType: membershipType,
      },
    };
    // what evrer the data of response it will stored it
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON() });
  } catch (err) {
    throw new Error(err.message);
  }
});

module.exports = paymentRouter;
