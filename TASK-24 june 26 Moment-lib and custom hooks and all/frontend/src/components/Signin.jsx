import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (form.email === "") errorObj.email = "Email is required";
    if (form.password === "") errorObj.password = "Password is required";

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:3000/users/signin",
        form,
      );

      console.log(result.data);

      localStorage.setItem("token", result.data.token);

      alert(result.data.message);

      navigate("/");
    } catch (err) {
      const msg = err.response.data.message;

      if (msg === "Email not found") {
        setError({
          email: msg,
        });
      }

      if (msg === "Login Password Incorrect") {
        setError({
          password: msg,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#eef2f3] to-white flex items-center justify-center p-5 font-[Poppins]">
      <div className="w-full max-w-md bg-white border border-[#ccc] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 text-sm bg-gray-100 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#222]">Welcome Back 👋</h1>

          <p className="text-[#666] mt-2">Login to continue</p>
        </div>

        <form onSubmit={handleChange} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border outline-none focus:border-blue-500"
            />

            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border outline-none focus:border-blue-500"
            />

            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgotpass")}
            className="text-blue-600 text-sm mt-2 hover:underline cursor-pointer "
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg  cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
