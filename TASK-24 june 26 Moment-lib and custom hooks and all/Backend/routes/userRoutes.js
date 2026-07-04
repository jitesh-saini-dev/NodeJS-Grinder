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
router.patch("/forgotpass", userController.forgotpass);

//verifyOtp
router.post("/verifyOtp", userController.verifyOtp);

//reset password
router.patch("/resetPassword", userController.resetPassword);

router.get("/me", authMiddleware, userController.getMe);

router.patch("/update-profile", authMiddleware, userController.updateProfile);

router.post("/google-login", userController.googleLogin);

module.exports = router;
