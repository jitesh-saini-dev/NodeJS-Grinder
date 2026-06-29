const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jiteshkumar2504@gmail.com",
    pass: "bfhy bera ifjm ukbl",
  },
});

module.exports = transporter;
