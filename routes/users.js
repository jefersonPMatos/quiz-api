const express = require("express");
const router = express.Router();
const userValidator = require("../middlewares/userValidator");
const userFirestoreController = require("../controllers/userFirestoreController");
const uploadAvatar = require("../middlewares/uploadAvatar");

// register
router.post(
  "/cadastrar",
  uploadAvatar,
  userValidator,
  userFirestoreController.registerUser
);
// check email
router.put(
  "/checkemail/:id",
  userValidator,
  userFirestoreController.checkEmail
);
// login
router.post("/login", userValidator, userFirestoreController.login);
// update
router.post("/:id", userValidator, userFirestoreController.update);
// delete
router.delete("/:id", userValidator, userFirestoreController.delete);

module.exports = router;
