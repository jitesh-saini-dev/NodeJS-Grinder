import React from "react";
import axios from "axios";
import { useState } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const obj = {};
    if (form.name === "") obj.name = "name is required";
    if (form.email === "") obj.email = "email is required";
    if (form.password === "") obj.password = "password is required";

    setError(obj);

    if (Object.keys(obj).length === 0) {
      axios.post("http://localhost:3000/users/signup", form);
      alert("Signup Form Submitted");
    }

    setForm({
      name: "",
      email: "",
      password: "",
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {error.name && <p>{error.name}</p>}
        <input
          type="text"
          placeholder="Enter your email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {error.email && <p>{error.email}</p>}

        <input
          type="text"
          placeholder="Enter your password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error.password && <p>{error.password}</p>}

        <button type="password">Submit</button>
      </form>
    </>
  );
};

export default Signup;
