import React from "react";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    const obj = {};
    if (form.email === "") obj.email = "email is required";
    if (form.password === "") obj.password = "password is required";

    setError(obj);

    if (Object.keys(obj).length === 0) {
      try {
        const res = await axios.post("http://localhost:3000/users/login", form);
        console.log(res.data);

        localStorage.setItem("token", JSON.stringify(res.data.token));

        alert("login successfully");

        setForm({
          email: "",
          password: "",
        });
      } catch (err) {
        console.log(err.response?.data);
        alert(err.response?.data?.message || "Login Failed");
      }
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {error.email && <p>{error.email}</p>}

        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error.password && <p>{error.password}</p>}

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Login;
