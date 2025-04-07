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

module.exports = {
  validateSignUpData,
};
