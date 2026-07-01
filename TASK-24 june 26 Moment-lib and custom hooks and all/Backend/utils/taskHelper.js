// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "jiteshkumar2504@gmail.com",
//     pass: "bfhy bera ifjm ukbl",
//   },
// });

// module.exports = transporter;

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

// const sendEmail =

// module.exports = transporter;

//------------------------------------------------------------

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

const sendTaskEmail = async (email, taskName, dueDate) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Task Assigned",
    html: `
      <h2>New Task Assigned</h2>
      <p>You have been assigned a new task.</p>
      <p><strong>Task Name:</strong> ${taskName}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
    `,
  });

  return info;
};

module.exports = { sendTaskEmail };
