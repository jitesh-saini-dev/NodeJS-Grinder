const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/17june26")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const salesdata = new Schema({
  data: Schema.Types.Mixed,
});

const customerData = new Schema({
  data: Schema.Types.Mixed,
});

const userModel = mongoose.model("users", salesdata); // collection + schema

//all
app.get("/sales", async (req, res) => {
  try {
    const result = await salesModel.find();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error ", err });
  }
});

//id
app.get("/sales/:id", async (req, res) => {
  console.log(">>>>>>>", req.params.id);

  if (!req.params.id) {
    return res.status(404).json({ message: " key not found " });
  }

  const result = await salesModel.findById(req.params.id);

  if (!result) {
    return res.status(400).json({ message: " no record  found " });
  }
  res.status(200).json(result);
});

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(3000, () => {
  console.log(`server is running on port 3000`);
});
