const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SecretKey = "b3hktb3ktbh3tb33453534b5o4b52ob524o5b25b42o5";

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userEmail = await userModel.findOne({ email });
    if (userEmail) {
      return res.status(400).json({
        message: " email already exist",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      name,
      email,
      password: hash,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingData = await userModel.findOne({ email });

    if (!existingData) {
      return res.status(400).json({
        message: " email Not Found",
      });
    }

    const match = await bcrypt.compare(password, existingData.password);

    if (!match) {
      return res.status(400).json({
        message: "Password not matched",
      });
    }

    const token = jwt.sign({ email }, SecretKey);
    return res.status(200).json({ message: "Login Sucessfully", token });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.forgot = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const userdetails = await userModel.findOne({ email });
    if (!userdetails) {
      return res.status(400).json({
        message: "email not found",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "newpassword and confirmpassword not matched",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await userModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.reset = async (req, res) => {
  try {
    const { email, password, newPassword, confirmNewPassword } = req.body;

    if (!email || !password || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const userdetails = await userModel.findOne({ email });
    if (!userdetails) {
      return res.status(400).json({
        message: "email not found",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "newPassword and confirmNewPassword not matched",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await userModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// exports.update = async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return res.status(200).json({
//       message: "All fields are required",
//     });
//   }
  

// };
