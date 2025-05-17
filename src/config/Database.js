const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://user:User123@namstedev.hp3ej.mongodb.net/DevTinder"
    // "mongodb://localhost:27017/DevTinder"
    process.env.DB_CONNECTION_STRING
  );
};

module.exports = connectDB;
