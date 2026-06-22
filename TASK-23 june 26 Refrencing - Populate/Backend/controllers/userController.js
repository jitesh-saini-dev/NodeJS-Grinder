const userModel = require("../models/userModel");
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

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;
//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }
//     const user = await singnupuser.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Email not found",
//       });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Password and Confirm Password do not match",
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await singnupuser.findByIdAndUpdate(
//       user._id,
//       {
//         password: hashedPassword,
//       },
//       { new: true },
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Password Updated Successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// GET ALL ACTIVE USERS

const createUser = async (req, res) => {
  try {
    const {
      status,
      firstName,
      lastName,
      age,
      gender,
      phone,
      email,
      address,
      state,
      country,
      education,
      university,
      graduationYear,
      occupation,
      company,
      department,
      experience,
      salary,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !phone ||
      !email ||
      !address ||
      !state ||
      !country ||
      !education ||
      !university ||
      !graduationYear ||
      !occupation ||
      !company ||
      !department ||
      !experience ||
      !salary
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const data = {
      status,
      firstName,
      lastName,
      age,
      gender,
      phone,
      email,
      address,
      state,
      country,
      education,
      university,
      graduationYear,
      occupation,
      company,
      department,
      experience,
      salary,
    };

    const savedData = new userModel(data);

    const result = await savedData.save();

    return res.status(201).json({ result });
  } catch (error) {
    console.log("ERROR =>", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createUser };

const getUsers = async (req, res) => {
  try {
    const result = await userModel.find({
      status: true,
    });

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

// GET INACTIVE USERS
const getInactiveUsers = async (req, res) => {
  try {
    const result = await userModel.find({
      status: false,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const result = await userModel.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const result = await userModel.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// SOFT DELETE
const deleteUser = async (req, res) => {
  try {
    const result = await userModel.findByIdAndUpdate(
      req.query._id,
      { status: false },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PERMANENT DELETE
const permanentDelete = async (req, res) => {
  try {
    const result = await userModel.findByIdAndDelete(req.query._id);

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Deleted permanently",

      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Restore
const restoreUser = async (req, res) => {
  try {
    const { _id } = req.body;

    const result = await userModel.findByIdAndUpdate(
      _id,
      { status: true },
      { new: true },
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  signup,

  getSignup,

  signin,

  forgotpass,

  resetPassword,

  createUser,

  getUsers,

  getInactiveUsers,

  getUserById,

  updateUser,

  deleteUser,

  permanentDelete,

  restoreUser,
};
