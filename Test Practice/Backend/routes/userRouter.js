const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.patch("/forgot", userController.forgot);
router.patch("/reset", userController.reset);


module.exports = router;
