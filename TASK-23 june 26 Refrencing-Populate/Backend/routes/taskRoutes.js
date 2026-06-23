const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware/auth");
const taskController = require("../controllers/taskController");

// Create User (Signup)
router.post("/posting", taskController.signup);

// Getting User (Signup)
router.get("/getSignupUser", authMiddleware, taskController.getSignup);

// Login User (Signin)
router.post("/signin", taskController.signin);

//create task
router.post("/addtasks", taskController.createTask);

module.exports = router;
