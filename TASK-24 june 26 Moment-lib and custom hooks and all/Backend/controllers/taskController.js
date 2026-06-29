const taskModel = require("../models/taskModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

const transporter = require("../utils/helper");

// CREATE USER (SIGNUP)
const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      phone,
      email,
      password,
      address,
      state,
      country,
      role,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !phone ||
      !email ||
      !password ||
      !address ||
      !state ||
      !country ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const data = {
      firstName,
      lastName,
      age,
      phone,
      email,
      password: hash,
      address,
      state,
      country,
      role,
    };

    const savedData = new authModel(data);
    const result = await savedData.save();

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//SignUp getData
const getSignup = async (req, res) => {
  try {
    console.log(">>>>user", req.user);
    const result = await authModel.find();

    if (result.length === 0) {
      return res.status(404).json({
        message: "No Users Found",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme } = req.body;

    const updatedUser = await authModel.findByIdAndUpdate(
      id,
      { theme },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Theme Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN USER (SIGNIN)
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        field: "email",
        message: "All fields are required",
      });
    }

    const existingData = await authModel.findOne({ email });

    if (!existingData) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const match = await bcrypt.compare(password, existingData.password);

    if (!match) {
      return res.status(400).json({
        message: "Login Password Incorrect",
      });
    }

    const token = jwt.sign({ email }, SecretKey);

    return res.status(200).json({
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//create task
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

    const info = await transporter.sendMail({
      from: "jiteshkumar2504@gmail.com",
      to: "sureshpareek9636@gmail.com",
      subject: "New Task Assigned",
      html: `
         <p>You have been placed.</p>
  `,
    });
    // amansidana55@gmail.com
    console.log(info.messageId);

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

//getAll active tasks
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
      .populate("assignTo", "firstName lastName email");

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

module.exports = {
  signup,

  getSignup,

  updateTheme,

  signin,

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
};
