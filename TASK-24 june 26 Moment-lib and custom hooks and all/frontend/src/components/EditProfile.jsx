import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    country: "",
    image: null,
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.data;

      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        state: user.state || "",
        country: user.country || "",
        image: null,
      });

      setPreview(user.image);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch profile");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("age", form.age);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("state", form.state);
      formData.append("country", form.country);

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await axios.patch(
        "http://localhost:3000/users/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

        <div className="flex justify-center mb-8">
          <div className="text-center">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-300 mx-auto"
            />

            <input type="file" onChange={handleImage} className="mt-4" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="email"
            value={form.email}
            disabled
            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className={inputClass}
          />

          <textarea
            rows="4"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className={`${inputClass} md:col-span-2`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-2 py-3 rounded-xl font-semibold text-white flex justify-center items-center gap-2 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
