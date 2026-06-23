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
router.post("/addtasks", authMiddleware, taskController.createTask);

//show tasks
router.get("/getAllTasks", authMiddleware, taskController.getAllTasks);

//show inactive tasks
router.get(
  "/getInactiveAllTasks",
  authMiddleware,
  taskController.getInactiveAllTasks,
);

//get taskbyid
router.get("/viewtask/:id", authMiddleware, taskController.getSingleTask);

//edit task
router.patch("/edittask/:id", authMiddleware, taskController.updateTask);

//soft delete
router.patch("/task/soft-delete/:id", taskController.softDeleteTask);

//restore
router.patch("/restore", authMiddleware, taskController.restoreTask);

//permanent delete
router.delete(
  "/permanent-delete",
  authMiddleware,
  taskController.permanentDeleteTask,
);

module.exports = router;
