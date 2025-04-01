const express = require("express");

const app = express();

// app.get("/", (req, res) => {
//   res.setHeader("Content-Type", "text/plain"); // Must set manually
//   res.end("hello from server");
// });
app.use("/", (req, res) => {
  res.send("hello from server");
});

app.get("/test", (req, res) => {
  res.send("this is running on port 3000/test");
});

app.get("/all", (req, res) => {
  res.send("all the data is coming from /all");
});

app.listen(3000, () => {
  console.log("port running successfully");
});
