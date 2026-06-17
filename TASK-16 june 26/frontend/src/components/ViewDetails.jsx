import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/getting/${id}`);

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">User Details</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p>
              <b>Name:</b> {user.firstName} {user.lastName}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Phone:</b> {user.phone}
            </p>

            <p>
              <b>Age:</b> {user.age}
            </p>

            <p>
              <b>Gender:</b> {user.gender}
            </p>

            <p>
              <b>Address:</b> {user.address}
            </p>

            <p>
              <b>City:</b> {user.city}
            </p>

            <p>
              <b>State:</b> {user.state}
            </p>

            <p>
              <b>Country:</b> {user.country}
            </p>
          </div>

          <div className="space-y-3">
            <p>
              <b>Education:</b> {user.education}
            </p>

            <p>
              <b>University:</b> {user.university}
            </p>

            <p>
              <b>Graduation Year:</b> {user.graduationYear}
            </p>

            <p>
              <b>Occupation:</b> {user.occupation}
            </p>

            <p>
              <b>Company:</b> {user.company}
            </p>

            <p>
              <b>Department:</b> {user.department}
            </p>

            <p>
              <b>Experience:</b> {user.experience} Years
            </p>

            <p>
              <b>Salary:</b> ₹{user.salary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
