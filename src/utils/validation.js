const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("enter a valid First Name and Last Name");
  } else if (!validator.isEmail(email)) {
    throw new Error("enter a valid emailID ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "gender",
    "age",
    "about",
    "skills",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateForgotPassword = (req) => {
  const validate = (password) => {
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not valid...");
    }
  };

  validate(req.body.password);
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateForgotPassword,
};
