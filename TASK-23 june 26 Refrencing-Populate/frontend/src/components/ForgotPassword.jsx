import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.email) errorObj.email = "Email is required";
    if (!form.password) errorObj.password = "Password is required";
    if (!form.confirmPassword)
      errorObj.confirmPassword = "Confirm Password is required";

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    try {
      const result = await axios.patch(
        "http://localhost:3000/user/forgot",
        form,
      );

      alert(result.data.message);

      navigate("/signin");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg.includes("Email")) {
        setError({
          email: msg,
        });
      }

      if (msg.includes("Confirm")) {
        setError({
          confirmPassword: msg,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
          {error.password && (
            <p className="text-red-500 text-sm">{error.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-3 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />
          {error.confirmPassword && (
            <p className="text-red-500 text-sm">{error.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
