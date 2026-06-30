const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../authMiddleware/auth");

// Create User (Signup)
router.post("/posting", userController.signup);

// Getting User (Signup)
router.get("/getSignupUser", authMiddleware, userController.getSignup);

// Login User (Signin)
router.post("/signin", userController.signin);

//forgot password
router.patch("/forgot", userController.forgotpass);

//reset password
router.patch("/resetPassword", userController.resetPassword);

module.exports = router;
