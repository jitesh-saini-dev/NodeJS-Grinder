const taskModel = require("../models/taskModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

const { sendWelcomeEmail } = require("../utils/userHelper");

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

    const existingUser = await authModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
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

    const info = await sendWelcomeEmail(email, firstName);
    console.log(info.messageId);

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

//forgot Password
const forgotpass = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingData = await authModel.findOne({ email });

    if (!existingData) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password do not match",
      });
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(">>>>salt", salt);
    const hash = bcrypt.hashSync(password, salt);
    console.log(">>>>>hash", hash);

    const result = await authModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );

    return res.status(200).json({
      message: "Password Updated Successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, password, newPassword, confirmPassword } = req.body;

    if (!email || !password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingData = await authModel.findOne({ email });

    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const match = await bcrypt.compare(password, existingData.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Old Password Incorrect",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match",
      });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    console.log(">>>>salt", salt);

    const hash = bcrypt.hashSync(newPassword, salt);

    console.log(">>>>>hash", hash);

    const result = await authModel.findOneAndUpdate(
      { email },
      {
        password: hash,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: "Password Updated Successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  signup,

  getSignup,

  forgotpass,

  resetPassword,

  signin,
};
