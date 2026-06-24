const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth", // Must match the model name exactly
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },

    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;
