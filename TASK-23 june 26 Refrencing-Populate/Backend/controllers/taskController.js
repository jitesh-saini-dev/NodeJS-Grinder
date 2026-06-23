const taskModel = require("../models/taskModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

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
      !country
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //Synchronous
    // const saltRounds = 10;
    // const salt = bcrypt.genSaltSync(saltRounds);
    // console.log(">>>>salt", salt);
    // const hash = bcrypt.hashSync(password, salt);
    // console.log(">>>>>hash", hash);
    //--------------------
    // //Asynchronous production ready
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
    const { taskName, status } = req.body;

    const user_id = req.user._id; // middleware se

    if (!user_id || !taskName) {
      return res.status(400).json({
        success: false,
        message: "User ID and Task Name are required",
      });
    }

    const task = await taskModel.create({
      user_id,
      taskName,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getall tasks


module.exports = {
  signup,

  getSignup,

  signin,

  createTask,
};
