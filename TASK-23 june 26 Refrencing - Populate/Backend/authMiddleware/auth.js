const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

const SecretKey =
  "d1628e12e40915c6cb23658430db9bcc70852795fffe542fa2b4223ee73145f0";

const auth = async (req, res, next) => {
  try {
    const authtoken = req.headers.authorization;
    // console.log(req.headers);
    // console.log(req.headers.authorization);

    if (!authtoken) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const token = authtoken.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token value is empty",
      });
    }

    const decode = jwt.verify(token, SecretKey);

    const { email } = decode;

    if (!email) {
      return res.status(400).json({
        message: "Email payload missing",
      });
    }

    const userdetail = await authModel.findOne({ email });

    if (!userdetail) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = userdetail;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;
