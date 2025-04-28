const express = require("express");
const { userAuth } = require("../middleware/Authentication");
const { validEditProfileData } = require("..//utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    res.send(user);
  } catch (err) {
    res.json({ Error: err });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validEditProfileData) {
      throw new Error("Invalid request ");
    }
    const loginUser = req.user;

    Object.keys(req.body).forEach((key) => (loginUser[key] = req.body[key]));
    // we will check the data from the validEditProfileData and request.body data
    await loginUser.save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = profileRouter;
