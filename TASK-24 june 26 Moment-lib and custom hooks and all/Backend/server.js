const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

//cron
require("./cron/taskReminder");

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/AllTasks")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });

// Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
