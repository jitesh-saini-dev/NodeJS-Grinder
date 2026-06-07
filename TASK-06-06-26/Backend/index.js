const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/products")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const itemsdata = new Schema({
  data: Schema.Types.Mixed,
});

const ProductModel = mongoose.model("items", itemsdata);

//alldata
app.get("/", async (req, res) => {
  try {
    const result = await ProductModel.find();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error ", err });
  }
});

//id
app.get("/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await ProductModel.findOne({ id });

    if (!result) {
      return res.status(404).json({
        message: "No record found",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//title
app.get("/items/title/:title", async (req, res) => {
  try {
    const title = req.params.title;

    const result = await ProductModel.find({ title });

    if (!result) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//category
app.get("/items/category/:category", async (req, res) => {
  try {
    const category = req.params.category;

    const result = await ProductModel.find({ category });

    if (!result) {
      return res.status(404).json({
        message: "no record found",
      });
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000...");
});
