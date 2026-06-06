const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/salesandcustomers")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const salesdata = new Schema({
  data: Schema.Types.Mixed,
});

const salesModel = mongoose.model("sales", salesdata);

app.get("/", (req, res) => {
  res.send("server running...");
});

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

//product name
app.get("/sales/product/:product", async (req, res) => {
  console.log(">>>>>>>", req.params.product);

  if (!req.params.product) {
    return res.status(404).json({ message: " product not found " });
  }
  // const result = await salesModel.find({
  //   product: req.params.product, // agr key me bhi product h or value me bhi toh direct kr skte h key value ki need nhi h jse ki neeche kiya h
  // });

  const product = req.params.product;

  const result = await salesModel.find({
    product,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

// amount
app.get("/sales/amount/:amount", async (req, res) => {
  console.log(">>>>>>>", req.params.amount);

  if (!req.params.amount) {
    return res.status(404).json({ message: " amount not found " });
  }

  const result = await salesModel.find({
    amount: req.params.amount,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//status, limit,skip
app.get("/getdata", async (req, res) => {
  console.log(">>>>>>", req.query);
  const { limit, skip, status } = req.query;
  const result = await salesModel.find({ status }).skip(skip).limit(limit);
  res.status(200).json(result);
});

//product + city
app.get("/getdata", async (req, res) => {
  console.log(">>>>>>", req.query);
  const { product, city } = req.query;
  const result = await salesModel.find({ product, city });
  res.status(200).json(result);
});
//status + paymentMethod
app.get("/getdata2", async (req, res) => {
  console.log(">>>>>>", req.query);
  const { status, paymentMethod } = req.query;
  const result = await salesModel.find({ status, paymentMethod });
  res.status(200).json(result);
});

//discount + category
app.get("/getdata5", async (req, res) => {
  console.log(">>>>>>", req.query);
  const { discount, category } = req.query;
  const result = await salesModel.find({ discount, category });
  res.status(200).json(result);
});

//product + status + city
app.get("/getdata4", async (req, res) => {
  console.log(">>>>>>", req.query);
  const { product, status, city } = req.query;
  const result = await salesModel.find({ product, status, city });
  res.status(200).json(result);
});

app.listen(3000, () => {
  console.log("server is running at 3000");
});
