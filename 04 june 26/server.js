const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/salesandcustomers")
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

const salesModel = mongoose.model("sales", salesdata); // collection + schema
const customerModel = mongoose.model("customers", customerData);

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

// category
app.get("/sales/category/:category", async (req, res) => {
  console.log(">>>>>>>", req.params.category);

  if (!req.params.category) {
    return res.status(404).json({ message: " category not found " });
  }

  const result = await salesModel.find({
    category: req.params.category,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

// status
app.get("/sales/status/:status", async (req, res) => {
  console.log(">>>>>>>", req.params.status);

  if (!req.params.status) {
    return res.status(404).json({ message: " status not found " });
  }

  const result = await salesModel.find({
    status: req.params.status,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

// paymentMethod
app.get("/sales/paymentMethod/:paymentMethod", async (req, res) => {
  console.log(">>>>>>>", req.params.paymentMethod);

  if (!req.params.paymentMethod) {
    return res.status(404).json({ message: " payment method not found " });
  }

  const result = await salesModel.find({
    paymentMethod: req.params.paymentMethod,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

// city
app.get("/sales/city/:city", async (req, res) => {
  console.log(">>>>>>>", req.params.city);

  if (!req.params.city) {
    return res.status(404).json({ message: " city not found " });
  }

  const result = await salesModel.find({
    city: req.params.city,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//all customer
app.get("/customers", async (req, res) => {
  const result = await customerModel.find();

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//by id
app.get("/customers/:id", async (req, res) => {
  console.log(">>>>>>>", req.params.id);

  if (!req.params.id) {
    return res.status(404).json({ message: " key not found " });
  }

  const result = await customerModel.findById(req.params.id);

  if (!result) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//name
app.get("/customers/name/:name", async (req, res) => {
  console.log(">>>>>>>", req.params.name);

  if (!req.params.name) {
    return res.status(404).json({ message: " name not found " });
  }

  const result = await customerModel.find({
    name: req.params.name,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//email
app.get("/customers/email/:email", async (req, res) => {
  console.log(">>>>>>>", req.params.email);

  if (!req.params.email) {
    return res.status(404).json({ message: " email not found " });
  }

  const result = await customerModel.find({
    email: req.params.email,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//membership
app.get("/customers/membership/:membership", async (req, res) => {
  console.log(">>>>>>>", req.params.membership);

  if (!req.params.membership) {
    return res.status(404).json({ message: " membership not found " });
  }

  const result = await customerModel.find({
    membership: req.params.membership,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

//age
app.get("/customers/age/:age", async (req, res) => {
  console.log(">>>>>>>", req.params.age);

  if (!req.params.age) {
    return res.status(404).json({ message: " age not found " });
  }

  const result = await customerModel.find({
    age: req.params.age,
  });

  if (!result.length) {
    return res.status(400).json({ message: " no record found " });
  }

  res.status(200).json(result);
});

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(3000, () => {
  console.log(`server is runningon port 3000`);
});
