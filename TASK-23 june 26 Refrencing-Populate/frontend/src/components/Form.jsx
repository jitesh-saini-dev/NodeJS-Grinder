import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [form, setForm] = useState({
    // Personal Information
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

    // Education Information
    education: "",
    university: "",
    graduationYear: "",

    // Professional Information
    occupation: "",
    company: "",
    department: "",
    experience: "",
    salary: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorObj = {};

    if (!form.firstName) errorObj.firstName = "First name is required";
    if (!form.lastName) errorObj.lastName = "Last name is required";
    if (!form.age) errorObj.age = "Age is required";
    if (!form.gender) errorObj.gender = "Gender is required";
    if (!form.email) errorObj.email = "Email is required";
    if (!form.phone) errorObj.phone = "Phone is required";
    if (!form.address) errorObj.address = "Address is required";
    if (!form.state) errorObj.state = "State is required";
    if (!form.country) errorObj.country = "Country is required";
    if (!form.education) errorObj.education = "Education is required";
    if (!form.university) errorObj.university = "University is required";
    if (!form.graduationYear)
      errorObj.graduationYear = "Graduation year is required";
    if (!form.occupation) errorObj.occupation = "Occupation is required";
    if (!form.company) errorObj.company = "Company is required";
    if (!form.department) errorObj.department = "Department is required";
    if (!form.experience) errorObj.experience = "Experience is required";
    if (!form.salary) errorObj.salary = "Salary is required";

    setError(errorObj);

    if (Object.keys(errorObj).length === 0) {
      console.log(form);

      try {
        const response = await axios.post(
          "http://localhost:3000/user/users",
          form,
        );
        console.log(">>>>>>>>>success", response.data);
      } catch (err) {
        console.log("error in sending data", err);
      }

      setForm({
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
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded-lg 
             bg-gradient-to-r from-indigo-500 to-purple-600 
             text-white text-sm font-semibold 
             shadow-md 
             hover:scale-[1.03] active:scale-[0.97] 
             transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Add User
        </h2>

        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              className={inputClass}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            {error.firstName && (
              <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              className={inputClass}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            {error.lastName && (
              <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              placeholder="25"
              className={inputClass}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            {error.age && (
              <p className="text-red-500 text-sm mt-1">{error.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              className={inputClass}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {error.gender && (
              <p className="text-red-500 text-sm mt-1">{error.gender}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {error.phone && (
              <p className="text-red-500 text-sm mt-1">{error.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              rows={3}
              placeholder="Enter your address"
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {error.address && (
              <p className="text-red-500 text-sm mt-1">{error.address}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              placeholder="Rajasthan"
              className={inputClass}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            {error.state && (
              <p className="text-red-500 text-sm mt-1">{error.state}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              placeholder="India"
              className={inputClass}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            {error.country && (
              <p className="text-red-500 text-sm mt-1">{error.country}</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">
            Education Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Education
              </label>
              <select
                className={inputClass}
                value={form.education}
                onChange={(e) =>
                  setForm({ ...form, education: e.target.value })
                }
              >
                <option value="">Select Qualification</option>
                <option>B.Tech</option>
                <option>BCA</option>
                <option>MCA</option>
                <option>M.Tech</option>
                <option>MBA</option>
                <option>PhD</option>
              </select>
              {error.education && (
                <p className="text-red-500 text-sm mt-1">{error.education}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                University
              </label>
              <input
                type="text"
                placeholder="University Name"
                className={inputClass}
                value={form.university}
                onChange={(e) =>
                  setForm({ ...form, university: e.target.value })
                }
              />
              {error.university && (
                <p className="text-red-500 text-sm mt-1">{error.university}</p>
              )}
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Graduation Year
              </label>
              <input
                type="number"
                placeholder="2024"
                className={inputClass}
                value={form.graduationYear}
                onChange={(e) =>
                  setForm({ ...form, graduationYear: e.target.value })
                }
              />
              {error.graduationYear && (
                <p className="text-red-500 text-sm mt-1">
                  {error.graduationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">
            Professional Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <input
                type="text"
                placeholder="Occupation"
                className={inputClass}
                value={form.occupation}
                onChange={(e) =>
                  setForm({ ...form, occupation: e.target.value })
                }
              />
              {error.occupation && (
                <p className="text-red-500 text-sm mt-1">{error.occupation}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Company Name"
                className={inputClass}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              {error.company && (
                <p className="text-red-500 text-sm mt-1">{error.company}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Department"
                className={inputClass}
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              {error.department && (
                <p className="text-red-500 text-sm mt-1">{error.department}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Experience (Years)"
                className={inputClass}
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
              />
              {error.experience && (
                <p className="text-red-500 text-sm mt-1">{error.experience}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Annual Salary"
                className={inputClass}
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
              {error.salary && (
                <p className="text-red-500 text-sm mt-1">{error.salary}</p>
              )}
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
