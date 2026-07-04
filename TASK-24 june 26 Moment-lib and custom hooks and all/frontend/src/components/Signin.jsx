import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../firebase";

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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      const response = await axios.post(
        "http://localhost:3000/users/google-login",
        {
          token: firebaseToken,
        },
      );

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-4 font-['Inter']">
      <div className="w-full max-w-[430px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-7">
    

        {/* Header */}
        <div className="text-center mb-7 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleChange} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            focus:bg-white
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            transition-all
            duration-300
          "
            />

            {error.email && (
              <p className="text-red-500 text-sm mt-2">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            focus:bg-white
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            transition-all
            duration-300
          "
            />

            {error.password && (
              <p className="text-red-500 text-sm mt-2">{error.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgotpass")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
          w-full
          py-3
          rounded-xl
          bg-gray-900
          hover:bg-black
          text-white
          font-semibold
          text-base
          shadow-lg
          hover:shadow-xl
          hover:scale-[1.02]
          transition-all
          duration-300
          cursor-pointer
        "
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 border-t border-gray-200"></div>

            <span className="text-gray-400 text-sm font-medium">OR</span>

            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
          w-full
          flex
          items-center
          justify-center
          gap-3
          py-3
          rounded-xl
          border
          border-gray-200
          bg-white
          hover:bg-gray-50
          hover:shadow-lg
          transition-all
          duration-300
          font-medium
          text-gray-700
          cursor-pointer
        "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Signup */}
          <div className="text-center pt-2">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="
              text-blue-600
              font-semibold
              hover:text-blue-700
              hover:underline
              cursor-pointer
            "
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
