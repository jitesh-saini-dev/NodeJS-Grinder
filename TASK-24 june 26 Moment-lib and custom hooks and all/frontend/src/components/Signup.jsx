import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    role: "user",
    theme: "light",
    image: "",
  });

  const [error, setError] = useState({});

  const navigate = useNavigate();

  function handlechange(e) {
    e.preventDefault();

    const errorobj = {};

    if (form.firstName === "") errorobj.firstName = "First name is required";
    if (form.lastName === "") errorobj.lastName = "Last name is required";
    if (form.email === "") errorobj.email = "Email is required";
    if (form.password === "") errorobj.password = "Password is required";
    if (form.age === "") errorobj.age = "Age is required";
    if (form.phone === "") errorobj.phone = "Phone no. is required";
    if (form.address === "") errorobj.address = "address is required";
    if (form.state === "") errorobj.state = "State is required";
    if (form.country === "") errorobj.country = "Country is required";
    if (form.role === "") errorobj.role = "Role is required";

    setError(errorobj);

    if (Object.keys(errorobj).length === 0) {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      axios
        .post("http://localhost:3000/users/posting", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);

          alert("Signup Successfully 🎉");

          setForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            age: "",
            phone: "",
            address: "",
            state: "",
            country: "",
            role: "user",
            theme: "light",
            image: "",
          });

          navigate("/signin");
        })
        .catch((err) => {
          console.log("Full Error:", err);
          console.log("Response:", err.response);
          console.log("Data:", err.response?.data);
        });
    }
  }

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
      <div className="w-full max-w-[850px] bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-gray-600 hover:text-black transition text-sm font-medium cursor-pointer"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account 🚀
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Join us and start managing your tasks smarter
          </p>
        </div>

        <form onSubmit={handlechange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
              {error.firstName && (
                <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lastName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
              {error.lastName && (
                <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.files[0],
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50"
              />
            </div>

            {/* Preview */}
            {form.image && (
              <div className="md:col-span-2 flex justify-center">
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}

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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            {/* Role */}
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Theme */}
            <select
              value={form.theme}
              onChange={(e) =>
                setForm({
                  ...form,
                  theme: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            >
              <option value="">Select Theme</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            {/* State */}
            <input
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  state: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            {/* Country */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    country: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold shadow-lg transition-all duration-300"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center mt-5 text-gray-500 text-sm">
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-semibold cursor-pointer ml-2 hover:underline"
            >
              Login
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-300 font-medium text-gray-700"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
