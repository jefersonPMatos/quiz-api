const express = require("express");
const router = express.Router();
const userFirestoreController = require("../controllers/userFirestoreController");

// register
router.post("/register", userFirestoreController.registerUser);
// check email
router.put("/checkDoc/:id", userFirestoreController.checkDoc);

module.exports = router;
