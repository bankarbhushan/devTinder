// // app.get("/", (req, res) => {
// //   res.setHeader("Content-Type", "text/plain"); // Must set manually
// //   res.end("hello from server");
// // });

// // ================ testing the all HTTPS Methods ========================== //

// // app.post("/user", (req, res) => {
// //   res.send({
// //     Firstname: " bhushan",
// //     Lastname: " Bankar ",
// //   });
// // });

// // app.get("/user", (req, res) => {
// //   res.send("Data is coming from teh user ");
// // });

// // app.delete("/user", (req, res) => {
// //   res.send("All the databased data is deleted successfully");
// // });

// // app.get("/test", (req, res) => {
// //   res.send("this is running on port 3000/test");
// // });
// // app.get("/test/2", (req, res) => {
// //   res.send("test 2");
// // });

// // app.get("/all", (req, res) => {
// //   res.send("all the data is coming from /all");
// // });

// // app.use("/", (req, res) => {
// //   res.send("hello from server");
// // });

// // =============================== dynamic rounting  ================= //

// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send("this is an user data ...");
// });
// // http://localhost:3000/user?userId=123

// app.get("/user/:userId", (req, res) => {
//   console.log(req.params);
//   res.send("dynamic user id ");
// });
// // http://localhost:3000/user/123

// app.get("/user/:userId/:userName/:password", (req, res) => {
//   console.log(req.params);
//   res.send("dynamic user id with username and password");
// });

// // ================================================================================ //

// app.listen(3000, () => {
//   console.log("port running successfully");
// });

// const express = require("express");
// const app = express();

// app.use(express.json()); // Middleware to parse JSON

// let users = [
//   { id: 1, name: "Alice", age: 25 },
//   { id: 2, name: "Bob", age: 30 },
// ];
// app.post("/users", (req, res) => {
//   res.send({ users });
// });
// // PATCH request to update user details
// app.patch("/users/:id", (req, res) => {
//   const userId = parseInt(req.params.id);
//   const { name, age } = req.body;

//   let user = users.find((u) => u.id === userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   if (name) user.name = name;
//   if (age) user.age = age;

//   res.json({ message: "User updated", user });

// });

// ======================================= handling multiple route handler ===============================//

// app.use("/user", [
//   (req, res, next) => {
//     // next();
//     // console.log("response 1");
//     // res.send("form Route Handler 1");
//   },
//   (req, res, next) => {
//     console.log("response 2");
//     // res.send("form Route Handler 2");
//     // next();
//   },
// ]);

// ======================================= handling multiple route handler with authentication  ===============================//

// app.use("/admin", (req, res, next) => {
//   console.log("admin authentication checked");
//   const token = "xyz";
//   const isAdminAuthoried = token === "xyz";
//   if (isAdminAuthoried) {
//     next();
//   } else {
//     res.status(401).send("Invalid Authentication");
//   }
// });

// app.use("/admin/deleteData", (req, res, next) => {
//   res.send("Data deleted successfully");
// });

// app.use("/admin/updateUser", (req, res, next) => {
//   res.send("Data update successfully");
// });

// ========================================================================

// const {
//   Adminvalidation,
//   UserValidation,
// } = require("./middleware/Authentication");

// app.use("/admin", Adminvalidation);

// app.use("/admin/deleteData", (req, res, next) => {
//   res.send("Data deleted successfully");
// });

// // this is because of for  only one user
// app.use("/User/getAllData", UserValidation, (req, res, next) => {
//   res.send("name : bhushan");
// });

// ======================================= handling multiple route handler with authentication  ===============================//
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something went Wrong ... ocntact to  support team ");
//   }
// });

// ======================================== before making the user dynamic =================================================//

// const express = require("express");
// const connectDB = require("./Utils/Database");
// const User = require("./models/User");
// const app = express();

// app.post("/signup", async (req, res) => {
//   const user = new User({
//     firstName: "bhushan",
//     lastName: "bankar",
//     email: "bhushan@gamil.com",
//     password: "123",
//     age: 12,
//   });
//   try {
//     await user.save();
//     res.send("user added successfully in the database");
//   } catch (err) {
//     console.log("Invalid request");
//   }
// });

// connectDB()
//   .then(() => {
//     console.log("Database Connection established successfully");

//     app.listen(3000, () => console.log("Server running on port 3000"));
//   })
//   .catch((err) => {
//     console.log("Database connection not established:", err.message);
//   });
