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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

        <p className="text-center text-gray-500 mb-4">{email}</p>

        {error.email && (
          <p className="text-red-500 text-center mb-4">{error.email}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full border p-3 rounded-lg"
            />

            {error.newPassword && (
              <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>
            )}
          </div>

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
              className="w-full border p-3 rounded-lg"
            />

            {error.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
