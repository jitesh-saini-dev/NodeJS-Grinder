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

exports.sendOtpEmail = async (email, firstName, otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding: 20px;">
        <h2>Hello ${firstName}, 👋</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div style="
          font-size: 30px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #2c3e50;
          background: #f4f4f4;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
        ">
          ${otp}
        </div>
        
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <br>
        <p>Thanks,<br><strong>Your Team</strong></p>
      </div>
    `,
  });

  return info;
};
