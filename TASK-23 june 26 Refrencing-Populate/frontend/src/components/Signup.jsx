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

    setError(errorobj);

    if (Object.keys(errorobj).length === 0) {
      axios
        .post("http://localhost:3000/tasks/posting", form)
        .then((res) => {
          console.log(res.data);

          // localStorage.setItem("user", JSON.stringify(form));
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#eef2f3] to-white flex items-center justify-center p-5 font-[Poppins]">
      <div className="w-full max-w-2xl bg-white border border-[#ccc] rounded-[20px] shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 bg-gray-100 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Create Account 🚀</h1>

          <p className="text-gray-500 mt-2">Fill your details to continue</p>
        </div>

        <form onSubmit={handlechange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.firstName && (
                <p className="text-red-500 text-sm">{error.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.lastName && (
                <p className="text-red-500 text-sm">{error.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.email && (
                <p className="text-red-500 text-sm">{error.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.password && (
                <p className="text-red-500 text-sm">{error.password}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.age && <p className="text-red-500 text-sm">{error.age}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.phone && (
                <p className="text-red-500 text-sm">{error.phone}</p>
              )}
            </div>

            {/* address */}
            <div>
              <input
                type="text"
                placeholder="City"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.address && (
                <p className="text-red-500 text-sm">{error.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.state && (
                <p className="text-red-500 text-sm">{error.state}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border outline-none"
              />

              {error.country && (
                <p className="text-red-500 text-sm">{error.country}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg"
          >
            Create Account
          </button>

          <p className="text-center mt-5">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer ml-2"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
