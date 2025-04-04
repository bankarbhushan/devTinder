const mongoose = require("mongoose");

const useSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("User", useSchema);
// name of model and schema
