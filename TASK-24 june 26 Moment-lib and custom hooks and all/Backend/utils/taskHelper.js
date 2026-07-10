// // const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: "jiteshkumar2504@gmail.com",
// //     pass: "bfhy bera ifjm ukbl",
// //   },
// // });

// // module.exports = transporter;

// // require("dotenv").config();
// // const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // const sendEmail =

// // module.exports = transporter;

// //------------------------------------------------------------

// require("dotenv").config();
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendTaskEmail = async (email, taskName, dueDate) => {
//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "New Task Assigned",
//     html: `
//       <h2>New Task Assigned</h2>
//       <p>You have been assigned a new task.</p>
//       <p><strong>Task Name:</strong> ${taskName}</p>
//       <p><strong>Due Date:</strong> ${dueDate}</p>
//     `,
//   });

//   return info;
// };

// module.exports = { sendTaskEmail };

//---------------------cron added---------------------
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// Task Assigned Email
// (Existing)
// ============================

const sendTaskEmail = async (email, taskName, dueDate) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "New Task Assigned 🚀",

    html: `
      <div style="font-family:Arial;padding:20px">

        <h2>New Task Assigned 🚀</h2>

        <p>You have been assigned a new task.</p>

        <p>
          <strong>Task Name:</strong>
          ${taskName}
        </p>

        <p>
          <strong>Due Date:</strong>
          ${dueDate}
        </p>

      </div>
    `,
  });

  return info;
};

// Task Reminder Email
// (Cron)

const sendTaskReminderEmail = async (email, taskName, dueDate) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Task Reminder 🔔",

    html: `

    <div style="
      font-family:Arial;
      padding:20px;
      background:#f8fafc;
    ">


      <div style="
        background:white;
        padding:25px;
        border-radius:12px;
      ">


        <h2>
          Task Reminder 🔔
        </h2>

        <p>
          Hello 👋
        </p>

        <p>
          This is a reminder that your task is due today.
        </p>


        <hr/>


        <p>
          <strong>Task Name:</strong>
          ${taskName}
        </p>


        <p>
          <strong>Due Date:</strong>
          ${dueDate}
        </p>


        <br/>


        <p>
          Please complete your task before the deadline.
        </p>


        <p>
          Thanks,<br/>
          Task Management Team
        </p>

      </div>
    </div>

    `,
  });

  return info;
};

module.exports = {
  sendTaskEmail,
  sendTaskReminderEmail,
};
