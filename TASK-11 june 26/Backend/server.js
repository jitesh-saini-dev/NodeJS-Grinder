const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/BMI")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const userSchema = new Schema({
  status: Boolean,
  name: String,
  email: String,
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
  bmitotal: Number,
});

const userModel = mongoose.model("bmiusers", userSchema);

app.post("/metric", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, age, gender, height, weight } = req.body;
    if (!name || !email || !age || !gender || !height || !weight) {
      return res.status(400).json({
        message: "All fields are required!!",
      });
    }
    const heightinMeter = height / 100;

    const bmitotal = weight / (heightinMeter * heightinMeter);
    console.log(bmitotal);

    const result = await userModel.create({ ...req.body, bmitotal });

    if (!result) {
      return res.status(404).json({
        message: "NO record found",
      });
    }

    return res.status(200).json({ result, bmitotal });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.get("/metric", async (req, res) => {
  try {
    const result = await userModel.find({ status: true });
    if (!result.length === 0) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.get("/metric/inactive", async (req, res) => {
  try {
    const result = await userModel.find({ status: false });
    if (!result.length === 0) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.get("/metric/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    if (!req.params.id) {
      return res.status(400).json({
        message: "Id not Found",
      });
    }
    const id = req.params.id;

    const result = await userModel.findById(id);
    if (!result) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.delete("/metric/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true },
    );
    if (!result) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.delete("/metric/permanent/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.patch("/metric/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await userModel.findByIdAndUpdate(id, data, { new: true });

    if (!result) {
      return res.status(404).json({
        message: "No record found",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
