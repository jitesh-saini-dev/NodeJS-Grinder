const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
    },

    education: {
      type: String,
    },

    university: {
      type: String,
    },

    graduationYear: {
      type: Number,
    },

    occupation: {
      type: String,
    },

    company: {
      type: String,
    },

    department: {
      type: String,
    },

    experience: {
      type: Number,
    },

    salary: {
      type: Number,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
