import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.newPassword) {
      errorObj.newPassword = "New Password is required";
    }

    if (!form.confirmPassword) {
      errorObj.confirmPassword = "Confirm Password is required";
    }

    if (
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      errorObj.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    try {
      const result = await axios.patch(
        "http://localhost:3000/users/resetPassword",
        {
          email,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        },
      );

      alert(result.data.message);

      // reset email remove
      localStorage.removeItem("resetEmail");

      navigate("/signin");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "User not found") {
        setError({
          email: msg,
        });
      }

      if (msg === "Please verify OTP first") {
        setError({
          email: msg,
        });
      }

      if (msg === "Passwords do not match") {
        setError({
          confirmPassword: msg,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center p-4 font-['Inter']">
      <div
        className="
    w-full
    max-w-md
    bg-white/90
    backdrop-blur-xl
    border
    border-white/50
    rounded-3xl
    shadow-[0_20px_60px_rgba(0,0,0,0.1)]
    p-8
  "
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="
        flex
        items-center
        gap-2
        text-gray-500
        hover:text-black
        transition
        mb-6
        font-medium
      "
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="
        w-20
        h-20
        mx-auto
        rounded-full
        bg-gray-100
        flex
        items-center
        justify-center
        text-4xl
      "
          >
            🔒
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-5">
            Reset Password
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Create a new password for your account
          </p>

          <p className="text-gray-800 font-semibold mt-3 break-all">{email}</p>
        </div>

        {/* Global Error */}
        {error.email && (
          <div
            className="
        mb-5
        bg-red-50
        border
        border-red-200
        text-red-600
        rounded-xl
        p-3
        text-sm
        text-center
      "
          >
            {error.email}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPassword: e.target.value,
                })
              }
              className="
            w-full
            px-4
            py-3
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            focus:border-gray-800
            focus:ring-4
            focus:ring-gray-100
            transition
          "
            />

            {error.newPassword && (
              <p className="text-red-500 text-sm mt-2">{error.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="
            w-full
            px-4
            py-3
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            focus:border-gray-800
            focus:ring-4
            focus:ring-gray-100
            transition
          "
            />

            {error.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
          w-full
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
        "
          >
            Reset Password
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?
          <span
            onClick={() => navigate("/signin")}
            className="
          ml-2
          text-blue-600
          font-semibold
          cursor-pointer
          hover:underline
        "
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
