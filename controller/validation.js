const { check, validationResult } = require("express-validator");

// Registration validation.
const registrationCheck = () => {
  return [
    check("username").isLength({ min: 2 }),
    check("email")
      .isEmail()
      .custom(email => {
        if (alreadyHaveEmail(email)) {
          throw new Error("Email already registred");
        }
      }),
    check("password").isLength({ min: 6 })
  ];
};

const registrationErrors = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resizeBy.status(422).json({ errors: errors.array() });
  }
};

module.exports = { registrationCheck, registrationErrors };
