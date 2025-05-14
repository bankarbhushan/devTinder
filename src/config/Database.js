const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://user:User123@namstedev.hp3ej.mongodb.net/DevTinder"
    "mongodb+srv://user:e1PBcO8lbn769HlZ@cluster0.7bfll.mongodb.net/DevTinder"
    // "mongodb://localhost:27017/DevTinder"
  );
};

module.exports = connectDB;
