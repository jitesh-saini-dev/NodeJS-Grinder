import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchByID, updateUser } from "../slice/userSlice";

const Edit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state se single user ka data nikal rahe hain
  const singleuser = useSelector((state) => state.users.singleUser);

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

  // Jaise hi page khule, API se user ka data fetch kar lo
  useEffect(() => {
    dispatch(fetchByID(id));
  }, [dispatch, id]);

  // Jab singleuser ka data aa jaye, toh usko Form ke state mein daal do (Auto-fill)
  useEffect(() => {
    if (singleuser && singleuser._id === id) {
      setForm({
        _id: singleuser._id || "",
        status: singleuser.status ?? true,
        firstName: singleuser.firstName || "",
        lastName: singleuser.lastName || "",
        age: singleuser.age || "",
        gender: singleuser.gender || "",
        phone: singleuser.phone || "",
        email: singleuser.email || "",
        address: singleuser.address || "",
        state: singleuser.state || "",
        country: singleuser.country || "",
        education: singleuser.education || "",
        university: singleuser.university || "",
        graduationYear: singleuser.graduationYear || "",
        occupation: singleuser.occupation || "",
        company: singleuser.company || "",
        department: singleuser.department || "",
        experience: singleuser.experience || "",
        salary: singleuser.salary || "",
      });
    }
  }, [singleuser, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorObj = {};

    // Basic Validation check
    if (!form.firstName) errorObj.firstName = "First name is required";
    if (!form.email) errorObj.email = "Email is required";
    
    setError(errorObj);

    if (Object.keys(errorObj).length === 0) {
      console.log("Updating data:", form);
      
      // Update action dispatch karenge aur dashboard par bhej denge
      dispatch(updateUser(form));
      navigate("/");
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
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:scale-[1.03] active:scale-[0.97] transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Edit User Data
        </h2>

        {/* --- Personal Information --- */}
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              className={inputClass}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            {error.firstName && <p className="text-red-500 text-sm mt-1">{error.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              className={inputClass}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              className={inputClass}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
             {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <input
              type="text"
              className={inputClass}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              className={inputClass}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
        </div>

        {/* --- Education Section --- */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">
            Education Details
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <select
                className={inputClass}
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
              >
                <option value="">Select Qualification</option>
                <option>B.Tech</option>
                <option>BCA</option>
                <option>MCA</option>
                <option>M.Tech</option>
                <option>MBA</option>
                <option>PhD</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="University Name"
                className={inputClass}
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Graduation Year"
                className={inputClass}
                value={form.graduationYear}
                onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* --- Professional Section --- */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">
            Professional Details
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Occupation"
              className={inputClass}
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company Name"
              className={inputClass}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Department"
              className={inputClass}
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <input
              type="number"
              placeholder="Experience (Years)"
              className={inputClass}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
            <input
              type="number"
              placeholder="Annual Salary"
              className={inputClass}
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
        </div>
        
        {/* Update Button */}
        <button
          type="submit"
          className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default Edit;