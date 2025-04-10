const express = require("express");
const connectDB = require("./src/config/Database");
const User = require("./src/models/User");
const { validateSignUpData } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
User.createIndexes();

// is a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads. When clients send data to your server in the form of JSON, this middleware is what enables your server to understand and process that data.
/*
req.body =={
          firstName: "bhushan",
          lastName: "bankar",
          email: "bhushan@gamil.com",
          password: "123",
          age: 12,
}
this json will come in the req.body
*/

app.post("/signup", async (req, res) => {
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
    // if (err.code === 11000) {
    //   res.send("Email already exists. Please use a different email.");
    // }

    res.status(400).json({ error: err.message });
    // json becouse we have to show the error in the post man
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credential");
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password);

    if (!isPasswordvalid) {
      throw new Error("Invalid Cedential");
    } else {
      res.send("Login successfull....");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/user", async (req, res) => {
  // go to postman and put the data in the body  {firstName:"bhushan"}

  const userName = req.body.firstName;

  try {
    const get_users = await User.find({
      firstName: userName,
    });
    if (get_users.length === 0) {
      res.status(404).send("User not Found in the database");
    } else {
      res.send(get_users);
    }
  } catch (err) {
    console.log("something went wrong" + err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find({});
    // get all the data from the databse
    res.send(allUser);
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userID = await req.body.userID;

  try {
    // console.log("userid", userID);

    await User.findByIdAndDelete(userID);
    res.send("user deleted successfully...");
  } catch (err) {
    console.log("error found ", err);
  }
});

app.patch("/user/:userID", async (req, res) => {
  // put this data in the posrtman {
  //     "userID":"67ef5dca689a9043fb553b3b",
  //     "name":"radha rani"
  // }

  const userID = req.params.userID;
  const data = req.body;
  console.log(data);

  try {
    const ALLOWED_UPDATE = ["skills", "age", "about", "gender"];
    const IS_ALLOWED = Object.keys(data).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );
    // we will map throught all the key if include in data it allow other wise iwill go to the if block
    if (!IS_ALLOWED) {
      throw new Error("update not allow");
    }
    if (data?.skills.length > 10) {
      throw new Error("you can not add more than 10 skills ..... ");
    }
    const result = await User.findOneAndUpdate({ _id: userID }, data, {
      runValidators: true,
      new: true,
    });
    console.log(result);
    res.send("user update successfully...");
  } catch (err) {
    console.log(err);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");
    app.listen(3002, () => console.log("Server running on port 3002"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
