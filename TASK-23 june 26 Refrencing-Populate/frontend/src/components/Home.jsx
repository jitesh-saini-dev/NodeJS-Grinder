import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();

  // Get All Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/tasks/getSignupUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  // const deleteUser = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/user/delete?_id=${id}`);

  //     fetchUsers();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Search
  const filteredData = users.filter(
    (x) =>
      x.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      x.lastName?.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort
  const sortedData = [...filteredData];

  if (sort === "ltoh") {
    sortedData.sort((a, b) => a.age - b.age);
  } else if (sort === "htol") {
    sortedData.sort((a, b) => b.age - a.age);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-5xl font-bold mb-6 text-center">Users Dashboard</h1>

      <div className="flex gap-4 mb-10">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-12 px-4 rounded-xl border"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-12 px-4 rounded-xl border"
        >
          <option value="">Sort By Age</option>

          <option value="ltoh">Low to High</option>

          <option value="htol">High to Low</option>
        </select>

        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white px-6 rounded-xl"
        >
          + Add User
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-4">First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Email</th>
            <th>Address</th>
            <th>State</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center p-5">
                No Data Found
              </td>
            </tr>
          ) : (
            sortedData.map((x) => (
              <tr key={x._id} className="text-center border-b">
                <td>{x.firstName}</td>

                <td>{x.lastName}</td>

                <td>{x.age}</td>

                <td>{x.phone}</td>

                <td>{x.role}</td>

                <td>{x.email}</td>

                <td>{x.address}</td>

                <td>{x.state}</td>

                <td>{x.country}</td>

                <td>
                  <button
                    onClick={() => navigate(`/viewdetails/${x._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${x._id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(x._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
