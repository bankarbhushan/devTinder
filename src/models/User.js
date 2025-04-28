const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid...");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not valid...");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Enter a valid gender");
        }
      },
    },
    skills: {
      type: [String],
      default: [],

      validate(skills) {
        if (skills.length > 10) {
          throw new console.error("you can not add more the 10 skills");
        }
      },
    },
    about: {
      type: String,
      default: "this is an about section by default value",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user.id }, "Abc@xyz@123", {
    expiresIn: "1d",
  });
  return token; // ✅ ONLY RETURN token
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = this.password;
  const isPasswordvalid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordvalid;
};

module.exports = mongoose.model("User", userSchema);
