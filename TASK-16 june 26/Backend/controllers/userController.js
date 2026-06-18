// const userModel = require("../models/userModel");

// const signup = async (req, res) => {
//   try {
//     console.log(req.body);
//     const savedData = new userModel(req.body);
//     const result = await savedData.save();
//     if (!result) {
//       return res.status(404).json({
//         message: "No Record Found",
//       });
//     }
//     return res.status(201).json(result);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const getUsers = async (req, res) => {
//   try {
//     const result = await userModel.find();

//     if (!result.length === 0) {
//       return res.status(404).json({
//         message: "No Users Found",
//       });
//     }

//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = { signup, getUsers };

const userModel = require("../models/userModel");
const authModel = require("../models/authModel");

// CREATE USER (SIGNUP)
const signup = async (req, res) => {
  try {
    // const result = await userModel.create(req.body);
    const savedData = new authModel(req.body);
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

// // LOGIN USER (SIGNIN)
// const signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await authModel.findOne({ email });

//     if (!result) {
//       return res.status(404).json({
//         message: "Email not found",
//       });
//     }

//     if (result.password !== password) {
//       return res.status(400).json({
//         message: "Wrong Password",
//       });
//     }

//     return res.status(200).json({
//       message: "Login Successfully",
//       result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// GET ALL ACTIVE USERS
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

  // signin,

  getUsers,

  getInactiveUsers,

  getUserById,

  updateUser,

  deleteUser,

  permanentDelete,

  restoreUser,
};
