const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware/auth");
const taskController = require("../controllers/taskController");

//create task
router.post("/addtasks", authMiddleware, taskController.createTask);

//show all tasks mainly admin
router.get("/getAllTasks", authMiddleware, taskController.getAllTasks);

//show tasks created by user
router.get("/createdAllTasks", authMiddleware, taskController.getCreatedTasks);

//show tasks assigned to user
router.get("/assignedTasks", authMiddleware, taskController.getAssignedTasks);

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
router.patch(
  "/task/soft-delete/:id",
  authMiddleware,
  taskController.softDeleteTask,
);

//restore
router.patch("/restore", authMiddleware, taskController.restoreTask);

//permanent delete
router.delete(
  "/permanent-delete",
  authMiddleware,
  taskController.permanentDeleteTask,
);

router.get("/calendarTasks", authMiddleware, taskController.getCalendarTasks);

router.get(
  "/download-report/:id",
  authMiddleware,
  taskController.downloadTaskReport,
);

router.get("/speak-task/:id", authMiddleware, taskController.speakTask);

module.exports = router;
