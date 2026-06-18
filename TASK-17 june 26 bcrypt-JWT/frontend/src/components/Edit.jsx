import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    _id: "",
    status: true,

    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    country: "",

    education: "",
    university: "",
    graduationYear: "",

    occupation: "",
    company: "",
    department: "",
    experience: "",
    salary: "",
  });

  const [error, setError] = useState({});

  // get single user

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/getting/${id}`);

      setForm(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.firstName) errorObj.firstName = "First name required";

    if (!form.email) errorObj.email = "Email required";

    setError(errorObj);

    if (Object.keys(errorObj).length === 0) {
      try {
        await axios.patch("http://localhost:3000/user/update", form);

        alert("User Updated");

        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center my-6">Edit User</h1>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            className={inputClass}
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          {error.firstName && <p className="text-red-500">{error.firstName}</p>}

          <input
            className={inputClass}
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {error.email && <p className="text-red-500">{error.email}</p>}

          <textarea
            className={inputClass}
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Education"
            value={form.education}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="University"
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Graduation Year"
            value={form.graduationYear}
            onChange={(e) =>
              setForm({ ...form, graduationYear: e.target.value })
            }
          />

          <input
            className={inputClass}
            placeholder="Occupation"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />

          <input
            className={inputClass}
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default Edit;
