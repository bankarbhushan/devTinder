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
const validEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "email",
  ];

  const isValidOperation = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid fields in edit profile request");
  }
};

module.exports = {
  validateSignUpData,
  validEditProfileData,
};
