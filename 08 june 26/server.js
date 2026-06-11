const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB CONNECT =================
mongoose
  .connect("mongodb://localhost:27017/BMI")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// ================= SCHEMA =================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
});

const User = mongoose.model("bmiuser", userSchema);

// ================= CREATE USER =================

app.post("/metric", async (req, res) => {
  try {
    const { name, email, age, gender, hight, weight } = req.body;

    if (!name || !email || !gender || !age || !hight || !weight) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await User.create(req.body);

    res.status(200).json({
      message: "User created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// // ================= GET USERS (ACTIVE ONLY) =================
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({ isDeleted: false }).sort({
//       _id: -1,
//     });

//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// });

// // ================= UPDATE USER =================
// app.patch("/users/:id", async (req, res) => {
//   try {
//     const result = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: "Update error" });
//   }
// });

// // ================= DELETE (SOFT DELETE - RECYCLER BIN) =================
// app.delete("/users/:id", async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.params.id, {
//       isDeleted: true,
//     });

//     res.json({ message: "Moved to Recycle Bin 🗑️" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete error" });
//   }
// });

// // ================= GET RECYCLE BIN =================
// app.get("/trash", async (req, res) => {
//   try {
//     const deletedUsers = await User.find({ isDeleted: true });
//     res.json(deletedUsers);
//   } catch (err) {
//     res.status(500).json({ message: "Trash error" });
//   }
// });

// // ================= RESTORE USER =================
// app.patch("/restore/:id", async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.params.id, {
//       isDeleted: false,
//     });

//     res.json({ message: "User restored ♻️" });
//   } catch (err) {
//     res.status(500).json({ message: "Restore error" });
//   }
// });

// // ================= permanent delet  USER =================

// app.delete("/trash/:id", async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted permanently" });
// });

app.get("/metric", async (req, res) => {
  console.log(`>>>>>`, req.body);

  const hight = req.body.h;
  console.log(hight);

  const hightmeter = hight / 100;
  console.log(hightmeter);

  const weight = req.body.w;
  console.log(weight);

  const BMI = weight / (hightmeter * hightmeter);
  console.log(BMI);

  return res.status(200).json(BMI);
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
