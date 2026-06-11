import { useState } from "react";
import axios from "axios";

const Form = () => {
  const [form, setForm] = useState({
    status: true,
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  async function handlsubmit(e) {
    e.preventDefault();

    const res = await axios.post("http://localhost:3000/metric", form);
    console.log(res.data);
    alert("Check Your BMI Report on BMI Users Page");

    setForm({
      status: true,
      name: "",
      email: "",
      gender: "",
      age: 0,
      height: 0,
      weight: 0,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-10">
        BMI Form Dashboard
      </h1>

      {/* FORM CARD */}
      <div className="flex justify-center">
        <form
          onSubmit={handlsubmit}
          className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 border border-slate-200 space-y-4"
        >
          <input
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            type="text"
            placeholder="Enter name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            type="text"
            placeholder="Enter email..."
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            type="text"
            placeholder="Enter gender..."
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              className="h-12 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />

            <input
              className="h-12 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />

            <input
              className="h-12 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="number"
              placeholder="Weight"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
