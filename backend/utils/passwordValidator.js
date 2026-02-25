const AppError = require("./appError");

exports.validatePassword = (password) => {
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isValid = Object.values(passwordRules).every(Boolean);

  if (!isValid) {
    throw new AppError(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
      400,
    );
  }

  return true;
};
