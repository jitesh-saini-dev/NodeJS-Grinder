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

exports.sendWelcomeEmail = async (email, firstName) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Created Successfully",
    html: `
      <h2>Welcome ${firstName} 🎉</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now login to the application.</p>
    `,
  });

  return info;
};
