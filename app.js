const express = require("express");
const connectDB = require("./Utils/Database");
const User = require("./models/User");
const app = express();

app.use(express.json());
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
  const user = new User(req.body);
  console.log(user);

  try {
    await user.save();
    res.send("user added successfully in the database");
  } catch (err) {
    console.log("Invalid request");
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
    console.log("something went wrong");
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

app.patch("/user", async (req, res) => {
  // put this data in the posrtman {
  //     "userID":"67ef5dca689a9043fb553b3b",
  //     "name":"radha rani"
  // }
  const userID = req.body.userID;
  const data = req.body;
  console.log(data);

  try {
    const result = await User.findOneAndUpdate({ userID }, data);
    console.log(result);

    res.send("user update successfully...");
  } catch (err) {
    console.log(err);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established successfully");

    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.log("Database connection not established:", err.message);
  });
