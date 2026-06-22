const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
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

    phone: {
      type: String,
    },

    role: {
      type: String,
      default: "pending",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;
