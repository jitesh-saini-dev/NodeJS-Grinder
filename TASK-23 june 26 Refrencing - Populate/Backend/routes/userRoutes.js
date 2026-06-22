const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../authMiddleware/auth");

// Create User (Signup)
router.post("/posting", userController.signup);

// Getting User (Signup)
router.get("/getSignupUser", userController.getSignup);

// Login User (Signin)
router.post("/signin", userController.signin);

//create user
router.post("/users", userController.createUser);

// Get All Users
router.get("/getting", auth, userController.getUsers);

// Get Single User By ID
router.get("/getting/:id", userController.getUserById);

// Update User
router.patch("/update", userController.updateUser);

// Soft Delete User
router.delete("/delete", userController.deleteUser);

// Permanent Delete User
router.delete("/permanent-delete", userController.permanentDelete);

//Inactive users
router.get("/inactive-users", auth, userController.getInactiveUsers);

//Restore
router.patch("/restore", userController.restoreUser);

//forgot password
router.patch("/forgot", userController.forgotpass);

//reset password
router.patch("/resetPassword", userController.resetPassword);

module.exports = router;
