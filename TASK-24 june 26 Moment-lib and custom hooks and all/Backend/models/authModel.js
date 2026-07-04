// const mongoose = require("mongoose");

// const authSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//     },

//     lastName: {
//       type: String,
//       required: true,
//     },

//     age: {
//       type: Number,
//     },

//     phone: {
//       type: String,
//     },

//     role: {
//       type: String,
//       default: "user",
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     address: {
//       type: String,
//     },

//     state: {
//       type: String,
//     },

//     country: {
//       type: String,
//     },
//     theme: {
//       type: String,
//       default: "light",
//     },
//     image: {
//       type: String,
//     },
//     otp: {
//       type: String,
//       default: null,
//     },

//     otpExpire: {
//       type: Date,
//       default: null,
//     },

//     otpVerified: {
//       type: Boolean,
//       default: false,
//     },

//     //for firebase Authentication
//     googleId: {
//       type: String,
//     },

//     provider: {
//       type: String,
//       default: "local",
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// const authModel = mongoose.model("auth", authSchema);

// module.exports = authModel;

const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      default: "",
    },

    age: {
      type: Number,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
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

    theme: {
      type: String,
      default: "light",
    },

    image: {
      type: String,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    // Google Login Fields
    googleId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;
