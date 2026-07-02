const taskModel = require("../models/taskModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

const { sendWelcomeEmail, sendOtpEmail } = require("../utils/userHelper");

const { uploadImage } = require("../utils/cloudinaryFileUpload");

// const googleTTS = require("google-tts-api"); // CommonJS

// CREATE USER (SIGNUP)
const signup = async (req, res) => {
  console.log(">>>>>>>>>>>req.body", req.body);
  console.log(">>>>>>>>>>>req.files", req.files);

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

    //----------------------
    const uploadData = await uploadImage(req.files);
    console.log(">>>>>>>uploadData", uploadData);
    const image = uploadData[0].url;

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
      image,
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

    // // get audio URL
    // const url = googleTTS.getAudioUrl("Hello World", {
    //   lang: "en",
    //   slow: false,
    //   host: "https://translate.google.com",
    // });
    // console.log('>>>>url',url); // https://translate.google.com/translate_tts?...

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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    user.otpVerified = false;

    await user.save();

    await sendOtpEmail(user.email, user.firstName, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify otp
const verifyOtp = async (req, res) => {
  // console.log("verifyOtp API Hit");

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP Expiry
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      user.otp = null;
      user.otpExpire = null;
      user.otpVerified = false;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    // console.log("DB OTP:", user.otp);
    // console.log("Received OTP:", otp);
    // console.log("DB OTP Type:", typeof user.otp);
    // console.log("Received OTP Type:", typeof otp);

    // Check OTP Match
    console.log("Comparison Result:", user.otp === otp.toString());

    if (user.otp !== otp.toString()) {
      console.log("Inside Invalid OTP Block");

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otpVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingData = await authModel.findOne({ email });

    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // OTP verify hua ya nahi
    if (!existingData.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingData.password = hashedPassword;

    // OTP related data clear
    existingData.otp = null;
    existingData.otpExpire = null;
    existingData.otpVerified = false;

    await existingData.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await authModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, lastName, age, phone, address, state, country } =
      req.body;

    let image = user.image;

    // agar nayi image upload hui hai
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadData = await uploadImage(req.files);
      image = uploadData[0].url;
    }

    const updatedUser = await authModel
      .findByIdAndUpdate(
        req.user._id,
        {
          firstName,
          lastName,
          age,
          phone,
          address,
          state,
          country,
          image,
        },
        {
          new: true,
        },
      )
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,

  getSignup,

  forgotpass,

  verifyOtp,

  resetPassword,

  signin,

  getMe,

  updateProfile,
};
