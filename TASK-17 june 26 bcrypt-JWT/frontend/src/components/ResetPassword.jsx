import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.email) errorObj.email = "Email is required";
    if (!form.password) errorObj.password = "Old Password is required";
    if (!form.newPassword) errorObj.newPassword = "New Password is required";
    if (!form.confirmPassword)
      errorObj.confirmPassword = "Confirm Password is required";

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    try {
      const result = await axios.patch(
        "http://localhost:3000/user/resetPassword",
        form,
      );

      alert(result.data.message);

      setError({});

      navigate("/signin");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Email not found") {
        setError({
          email: msg,
        });
      }

      if (msg === "Old Password Incorrect") {
        setError({
          password: msg,
        });
      }

      if (msg === "New Password and Confirm Password do not match") {
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Old Password */}
          <div>
            <input
              type="password"
              placeholder="Old Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

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
              className="w-full border p-3 rounded-lg"
            />
            {error.newPassword && (
              <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>
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
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
