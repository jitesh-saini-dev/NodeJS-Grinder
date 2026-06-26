const studentModel = require("../models/studentModel");

exports.posting = async (req, res) => {
  try {
    const { name, email, age, city } = req.body;

    if (!name || !email || !age || !city) {
      return res.status(200).json({
        message: "All fields are required",
      });
    }

    const studentdetails = await studentModel.findOne({ email });

    if (studentdetails) {
      return res.status(400).json({
        message: " email already exist",
      });
    }

    const result = await studentModel.create({
      name,
      email,
      age,
      city,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getall = async (req, res) => {
  try {
    const result = await studentModel.find();
    if (result.length === 0) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }
    const result = await studentModel.findById(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
