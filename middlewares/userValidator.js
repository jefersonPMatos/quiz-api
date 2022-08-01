const { check } = require("express-validator");

const userValidator = [
  check("email").notEmpty().isEmail().withMessage("Revise o campo e-mail"),
  check("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Revise o campo password"),
  check("cel")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Revise o campo celular"),
  check("birthday").notEmpty().withMessage("Revise o campo data"),
  check("fullname")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Revise o campo nome"),
  check("terms").notEmpty().isBoolean(),
];

module.exports = userValidator;
