const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/OurDb")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const userData = new Schema({
  status: Boolean,
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  phone: String,
  email: String,
  address: String,
  state: String,
  country: String,

  education: String,
  university: String,
  graduationYear: Number,

  occupation: String,
  company: String,
  department: String,
  experience: Number,
  salary: Number,
});

const userModel = mongoose.model("users", userData);

//post user
app.post("/users", async (req, res) => {
  console.log(req.body);

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

  // validation
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

  // email validation that duplicate na ho
  const existinguseremail = await userModel.findOne({ email });

  if (existinguseremail) {
    return res.status(400).json({
      message: "try new email already exist",
    });
  }

  const result = await userModel.create(req.body);

  return res.status(200).json(result);
});

// // Get all users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await userModel.find();

//     return res.status(200).json(users);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching users",
//       error: error.message,
//     });
//   }
// });

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({ status: true });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// 2. New Endpoint: Sirf Soft-Deleted/Trash wale users ke liye
app.get("/users/inactive", async (req, res) => {
  try {
    // Sirf wahi users jinka status explicitly false ho chuka hai
    const inactiveUsers = await userModel.find({ status: false });
    return res.status(200).json(inactiveUsers);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching inactive users",
      error: error.message,
    });
  }
});

//get by id
app.get("/users/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: " key not found " });
  }

  const result = await userModel.findById(req.params.id);

  if (!result) {
    return res.status(400).json({ message: " no record  found " });
  }
  res.status(200).json(result);
});

// // delete by id with query params
// app.delete("/users", async (req, res) => {
//   console.log(req.query);

//   const { _id } = req.query;

//   const result = await userModel.findByIdAndDelete(_id);

//   res.status(200).json(result);
// });

// Soft delete by id with query params
app.delete("/users", async (req, res) => {
  try {
    console.log(req.query);
    const { _id } = req.query;

    // Hard delete ki jagah, ab status: false update karenge
    const result = await userModel.findByIdAndUpdate(
      _id,
      { status: false },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Soft deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanent / Hard Delete by ID
app.delete("/users/permanent", async (req, res) => {
  try {
    console.log("Permanent Delete Query:", req.query);
    const { _id } = req.query;

    const result = await userModel.findByIdAndDelete(_id);
    res.status(200).json({ message: "Permanently deleted from DB", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/users", async (req, res) => {
  console.log(">>>>>>>>>>req", req.body);
  const id = req.body._id;
  const data = req.body;
  const result = await userModel.findByIdAndUpdate(id, data, { new: true });
  return res.status(200).json(result);
});

// app.patch("/users", async (req, res) => {
//   try {      
//     const { id } = req.query;
//     const data = req.body;

//     const result = await userModel.findByIdAndUpdate(id, data, { new: true });

//     return res.status(200).json(result);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

// app.patch("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;

//     const result = await userModel.findByIdAndUpdate(id, data, { new: true });

//     return res.status(200).json(result);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

app.get("/", (req, res) => {
  res.send("server is running...");
});
app.listen(3000, () => {
  console.log(`server is running on port 3000`);
});
