const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const userRouter = require("../Backend/routes/userRouter");
app.use("/users", userRouter);

const studentRoute = require("../Backend/routes/studentRoute");
app.use("/students", studentRoute);

mongoose
  .connect("mongodb://localhost:27017/testpractice")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
