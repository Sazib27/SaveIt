const validator = require("validator");

exports.validateRegister = (
  name,
  email,
  password
) => {

  if (!name || !email || !password) {

    return "All fields are required";

  }

  if (!validator.isEmail(email)) {

    return "Invalid email address";

  }

  if (
    !validator.isLength(password, {
      min: 6
    })
  ) {

    return
    "Password must be at least 6 characters";

  }

  return null;
};

exports.validateLogin = (
  email,
  password
) => {

  if (!email || !password) {

    return "Email and password required";

  }

  if (!validator.isEmail(email)) {

    return "Invalid email";

  }

  return null;
};