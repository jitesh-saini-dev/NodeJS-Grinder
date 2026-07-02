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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="mb-5 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-5">
          Enter your registered email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Verify OTP</h2>
                <p className="text-gray-500 mt-1">Enter the OTP sent to</p>
                <p className="font-semibold text-blue-600">{form.email}</p>
              </div>

              <button
                onClick={() => setShowOtpModal(false)}
                className="text-2xl text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              className="w-full mt-6 border rounded-xl p-4 text-center text-2xl tracking-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={handleSubmit}
              className="w-full mt-3 border py-3 rounded-xl hover:bg-gray-100"
            >
              Resend OTP
            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
