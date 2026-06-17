const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// Create User (Signup)
router.post("/posting", userController.signup);

// Login User (Signin)
router.post("/signin", userController.signin);

// Get All Users
router.get("/getting", userController.getUsers);

// Get Single User By ID
router.get("/getting/:id", userController.getUserById);

// Update User
router.patch("/update", userController.updateUser);

// Soft Delete User
router.delete("/delete", userController.deleteUser);

// Permanent Delete User
router.delete("/permanent-delete", userController.permanentDelete);

//Inactive users
router.get("/inactive-users", userController.getInactiveUsers);

//Restore
router.patch("/restore", userController.restoreUser);

module.exports = router;
