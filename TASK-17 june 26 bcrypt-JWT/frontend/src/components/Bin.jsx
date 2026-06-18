import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bin = () => {
  const navigate = useNavigate();

  const [inactiveUsers, setInactiveUsers] = useState([]);

  // Fetch Trash Users
  const fetchInactiveUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/inactive-users");

      setInactiveUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  // Restore User
  const restoreUser = async (id) => {
    try {
      await axios.patch("http://localhost:3000/user/restore", {
        _id: id,
      });

      fetchInactiveUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // Permanent Delete
  const permanentDeleteUser = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/user/permanent-delete?_id=${id}`,
      );

      fetchInactiveUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-xl"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10">Recycle Bin</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">State</th>
                <th className="p-4">Email</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {inactiveUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    Trash is Empty 🗑️
                  </td>
                </tr>
              ) : (
                inactiveUsers.map((x) => (
                  <tr key={x._id} className="text-center border-b">
                    <td className="p-3">{x._id}</td>
                    <td className="p-3">
                      {x.firstName} {x.lastName}
                    </td>
                    <td className="p-3">{x.age}</td>
                    <td className="p-3">{x.state}</td>
                    <td className="p-3">{x.email}</td>

                    <td className="p-3">
                      <button
                        onClick={() => restoreUser(x._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-3"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Delete permanently?")) {
                            permanentDeleteUser(x._id);
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete Permanently
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bin;
