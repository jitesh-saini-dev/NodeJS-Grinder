const cron = require("node-cron");
const taskModel = require("../models/taskModel");

const { sendTaskReminderEmail } = require("../utils/taskHelper");

// testing ke liye har minute
cron.schedule("0 9 * * *", async () => {
  console.log("Task reminder cron running...");

  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await taskModel
      .find({
        dueDate: {
          $gte: today,
          $lt: tomorrow,
        },

        status: {
          $ne: "completed",
        },

        isDeleted: false,
      })
      .populate("assignTo", "email firstName lastName");

    console.log("Today's Tasks:", tasks.length);

    for (const task of tasks) {
      if (task.assignTo?.email) {
        await sendTaskReminderEmail(
          task.assignTo.email,
          task.taskName,
          task.dueDate.toDateString(),
        );

        console.log("Mail sent to:", task.assignTo.email);
      }
    }
  } catch (error) {
    console.log("Cron Error:", error);
  }
});
