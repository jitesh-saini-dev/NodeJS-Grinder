const taskModel = require("../models/taskModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

const { sendTaskEmail } = require("../utils/taskHelper");

const { jsPDF } = require("jspdf");

const googleTTS = require("google-tts-api");
const axios = require("axios");

const createTask = async (req, res) => {
  try {
    const { taskName, assignedBy, dueDate, assignTo, status } = req.body;
    const user_id = req.user._id;

    if (!taskName || !dueDate || !assignTo) {
      return res.status(400).json({
        success: false,
        message: "Task Name, Due Date and Assign To are required",
      });
    }

    const task = await taskModel.create({
      user_id,
      assignedBy: req.user._id,
      assignTo,
      taskName,
      dueDate,
      status,
    });

    const assignedUser = await authModel.findById(assignTo);
    // console.log(assignedUser.email);

    const info = await sendTaskEmail(assignedUser.email, taskName, dueDate);
    // console.log(info);
    // console.log(info.messageId);

    return res.status(201).json({
      message: "Task Created Successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// //getAll active tasks
const getAllTasks = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
      });
    }

    const tasks = await taskModel
      .find({ isDeleted: false })
      .populate("user_id")
      .populate("assignTo")
      .populate("assignedBy");

    // console.log(JSON.stringify(tasks, null, 2));
    // console.log(taskModel.collection.name);
    // console.log(await taskModel.countDocuments());

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAll active tasks
const getCreatedTasks = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins should use the Admin Tasks section to view tasks.",
      });
    }
    const tasks = await taskModel
      .find({
        isDeleted: false,
        user_id: req.user._id,
      })
      .populate("user_id")
      .populate("assignTo");

    return res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//get assigned tasks to user
const getAssignedTasks = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins should use the Admin Tasks section to view tasks.",
      });
    }

    const tasks = await taskModel
      .find({
        isDeleted: false,
        assignTo: req.user._id,
      })
      .populate("user_id")
      .populate("assignTo");

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get inactive tasks
const getInactiveAllTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await taskModel
        .find({ isDeleted: true })
        .populate("user_id")
        .populate("assignTo");
    } else {
      tasks = await taskModel
        .find({ user_id: req.user._id, isDeleted: true })
        .populate("user_id")
        .populate("assignTo");
    }

    return res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//get taskByid
const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel
      .findById(id)
      .populate("user_id", "firstName lastName email")
      .populate("assignedBy", "firstName lastName email")
      .populate("assignTo", "firstName lastName email");

    // console.log(">>>>>>>>>>>>>>task");
    // console.log(JSON.stringify(task, null, 2));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//edit task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, dueDate, assignTo, status } = req.body;

    // Database mein task find karke update kar rahe hain
    // { new: true } return karega updated document
    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      {
        taskName,
        dueDate,
        assignTo,
        status,
      },
      { new: true, runValidators: true }, // runValidators schema ke rules check karega
    );

    // Agar task id se nahi mila
    if (!updatedTask) {
      return res.status(404).json({ message: "Task nahi mila bhai!" });
    }

    // Success response
    res.status(200).json({
      message: "Task ekdum badhiya se update ho gaya",
      data: updatedTask,
    });
  } catch (error) {
    console.log("Task update error:", error);
    res.status(500).json({
      message: "Server mein kuch gadbad hai",
      error: error.message,
    });
  }
};

//soft delete task
const softDeleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task nahi mila bhai!" });
    }

    return res.status(200).json({
      success: true,
      message: "Task delete ho gaya (Soft Delete)",
    });
  } catch (error) {
    console.log("Delete Task Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//restore task
const restoreTask = async (req, res) => {
  try {
    const { _id } = req.body;

    const task = await taskModel.findByIdAndUpdate(
      _id,
      { isDeleted: false },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task restored successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//permanent task delete
const permanentDeleteTask = async (req, res) => {
  try {
    const { _id } = req.query;

    const task = await taskModel.findByIdAndDelete(_id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task permanently deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Calender view
const getCalendarTasks = async (req, res) => {
  try {
    let tasks = [];

    // ADMIN
    if (req.user.role === "admin") {
      tasks = await taskModel
        .find({ isDeleted: false })
        .populate("assignedBy", "firstName lastName")
        .populate("assignTo", "firstName lastName");
    }

    // NORMAL USER
    else {
      tasks = await taskModel
        .find({
          isDeleted: false,
          $or: [{ assignedBy: req.user._id }, { assignTo: req.user._id }],
        })
        .populate("assignedBy", "firstName lastName")
        .populate("assignTo", "firstName lastName");
    }

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//PDF Download

const downloadTaskReport = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel
      .findById(id)
      .populate("user_id", "firstName lastName")
      .populate("assignTo", "firstName lastName");

    // console.log("REQ USER => ", req.user);
    // console.log("TASK USER => ", task.user_id?._id.toString());
    // console.log("ASSIGN TO => ", task.assignTo?._id.toString());

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    /*
      ADMIN -> kisi bhi task ki pdf download kar sakta hai

      USER -> sirf:
      1) jo usne assign ki hai
      2) jo usko assign hui hai
    */

    if (
      req.user.role !== "admin" &&
      task.user_id?._id.toString() !== req.user._id.toString() &&
      task.assignTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to download this report",
      });
    }

    const doc = new jsPDF();

    let y = 20;

    doc.text("TASK REPORT", 10, 10);

    doc.text(`Task Name : ${task.taskName}`, 10, y);
    y += 10;

    doc.text(
      `Assigned By : ${
        task.user_id
          ? `${task.user_id.firstName} ${task.user_id.lastName}`
          : "N/A"
      }`,
      10,
      y,
    );

    y += 10;

    doc.text(
      `Assigned To : ${
        task.assignTo
          ? `${task.assignTo.firstName} ${task.assignTo.lastName}`
          : "N/A"
      }`,
      10,
      y,
    );

    y += 10;

    doc.text(`Status : ${task.status}`, 10, y);

    y += 10;

    doc.text(
      `Due Date : ${new Date(task.dueDate).toLocaleDateString()}`,
      10,
      y,
    );

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${task.taskName}.pdf`,
    );

    res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const speakTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);

    const text = `
      Task Name ${task.taskName}.
      Current Status ${task.status}.
      Due Date ${new Date(task.dueDate).toLocaleDateString()}.
    `;

    const url = googleTTS.getAudioUrl(text, {
      lang: "en-IN",
      slow: false,
      host: "https://translate.google.com",
    });

    const response = await axios.get(url, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "audio/mpeg");

    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,

  getAllTasks,

  getCreatedTasks,

  getAssignedTasks,

  getInactiveAllTasks,

  getSingleTask,

  updateTask,

  softDeleteTask,

  restoreTask,

  permanentDeleteTask,

  getCalendarTasks,

  downloadTaskReport,

  speakTask,
};
