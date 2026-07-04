// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errorObj = {};

//     if (!form.email) errorObj.email = "Email is required";
//     if (!form.password) errorObj.password = "Password is required";
//     if (!form.confirmPassword)
//       errorObj.confirmPassword = "Confirm Password is required";

//     if (Object.keys(errorObj).length > 0) {
//       setError(errorObj);
//       return;
//     }

//     try {
//       const result = await axios.patch(
//         "http://localhost:3000/user/forgot",
//         form,
//       );

//       alert(result.data.message);

//       navigate("/signin");
//     } catch (err) {
//       const msg = err.response?.data?.message;

//       if (msg.includes("Email")) {
//         setError({
//           email: msg,
//         });
//       }

//       if (msg.includes("Confirm")) {
//         setError({
//           confirmPassword: msg,
//         });
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         <button
//           type="button"
//           onClick={() => navigate("/signin")}
//           className="mb-5 text-indigo-600 hover:text-indigo-800 font-semibold"
//         >
//           ← Back
//         </button>

//         <h1 className="text-4xl font-bold text-center text-gray-800">
//           Forgot Password
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-5">
//           Enter your email here.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Enter Email"
//             className="w-full border p-3 rounded"
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 email: e.target.value,
//               })
//             }
//           />
//           {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-3 rounded"
//           >
//             Send Email
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState({});

  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const result = await axios.post("http://localhost:3000/users/verifyotp", {
        email: form.email,
        otp,
      });

      alert(result.data.message);

      // Email save for reset password page
      localStorage.setItem("resetEmail", form.email);

      // Redirect
      navigate("/resetPassword");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.email) errorObj.email = "Email is required";

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    try {
      setLoading(true);

      const result = await axios.patch(
        "http://localhost:3000/users/forgotpass",
        form,
      );

      alert(result.data.message);

      // OTP Modal Open
      setShowOtpModal(true);
    } catch (err) {
      setError({
        email: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="min-h-screen  flex items-center justify-center p-4 font-['Inter']">
        <div className="w-full max-w-md rounded-3xl shadow-2xl p-7">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="mb-5 text-gray-600 hover:text-black font-medium transition flex items-center gap-2"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-gray-800">
              Forgot Password 🔐
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Enter your registered email address to receive an OTP.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                className="
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            outline-none
            focus:ring-4
            focus:ring-blue-100
            focus:border-blue-500
            transition
          "
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {error.email && (
                <p className="text-red-500 text-sm mt-2">{error.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          hover:from-blue-700
          hover:to-indigo-700
          text-white
          font-semibold
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-300
          disabled:opacity-60
        "
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 font-['Inter']">
          <div
            className="
      relative
      w-full
      max-w-md
      bg-white/90
      backdrop-blur-xl
      rounded-3xl
      border
      border-white/50
      shadow-[0_25px_80px_rgba(0,0,0,0.15)]
      p-8
      animate-in
      fade-in
      zoom-in-95
      duration-300
    "
          >
            {/* Close Button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="
          absolute
          top-5
          right-5
          w-10
          h-10
          rounded-full
          bg-gray-100
          hover:bg-gray-200
          text-gray-500
          hover:text-black
          transition-all
          duration-300
          flex
          items-center
          justify-center
          text-xl
        "
            >
              ✕
            </button>

            {/* Icon */}
            <div className="flex justify-center">
              <div
                className="
          w-20
          h-20
          rounded-full
          bg-gray-100
          flex
          items-center
          justify-center
          text-4xl
        "
              >
                🔐
              </div>
            </div>

            {/* Header */}
            <div className="text-center mt-5">
              <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Enter the verification code sent to
              </p>

              <p
                className="
          mt-2
          font-semibold
          text-gray-800
          break-all
        "
              >
                {form.email}
              </p>
            </div>

            {/* OTP Input */}
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="
          w-full
          mt-8
          py-4
          rounded-2xl
          border
          border-gray-200
          bg-gray-50
          text-center
          text-3xl
          tracking-[14px]
          font-semibold
          outline-none
          focus:border-gray-800
          focus:ring-4
          focus:ring-gray-100
          transition-all
        "
            />

            {/* Verify Button */}
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="
          w-full
          mt-7
          py-3.5
          rounded-2xl
          bg-gray-900
          hover:bg-black
          text-white
          font-semibold
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-300
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="
            flex-1
            py-3
            rounded-2xl
            border
            border-gray-200
            bg-white
            hover:bg-gray-50
            font-medium
            text-gray-700
            transition-all
          "
              >
                Resend
              </button>

              <button
                onClick={() => setShowOtpModal(false)}
                className="
            flex-1
            py-3
            rounded-2xl
            border
            border-gray-200
            bg-white
            hover:bg-gray-50
            font-medium
            text-gray-700
            transition-all
          "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
