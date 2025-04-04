const Adminvalidation = (req, res, next) => {
  console.log("admin authentication checked");
  const token = "xyz";
  const isAdminAuthoried = token === "xyz";
  if (isAdminAuthoried) {
    next();
  } else {
    res.status(401).send("Invalid Admin Authentication");
  }
};

const UserValidation = (req, res, next) => {
  const token = "abc";
  const isUserAuthoried = token === "abc";
  if (isUserAuthoried) {
    next();
  } else {
    res.status(401).send("Invalid User Authentication ");
  }
};

module.exports = {
  Adminvalidation,
  UserValidation,
};
