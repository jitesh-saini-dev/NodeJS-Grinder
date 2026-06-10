import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchAllData } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sely = useSelector((state) => state.users.data);
  console.log(sely);

  // Safe filtering by firstName or lastName
  const filteredData =
    sely?.filter(
      (x) =>
        x.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        x.lastName?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const sorteddata = [...filteredData];

  // Sorting logic based on Age
  if (sort === "ltoh") {
    sorteddata.sort((a, b) => a.age - b.age);
  } else if (sort === "htol") {
    sorteddata.sort((a, b) => b.age - a.age);
  }

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-5xl font-bold mb-6 text-center mt-5">
        Users Dashboard
      </h1>

      {/* searching + sorting + adduser */}
      <div className="flex flex-col md:flex-row gap-4 w-full items-center mb-10 mt-15">
        {/* Input (full flexible width) */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
          />
        </div>

        {/* Sort (fixed) */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-40 h-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium cursor-pointer"
        >
          <option value="">Sort By Age:</option>
          <option value="ltoh">Low to High</option>
          <option value="htol">High to Low</option>
        </select>

        {/* Button (fixed) */}
        <button
          className="w-36 h-12 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
          onClick={() => navigate("/form")}
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white">
            <tr className="text-center text-sm font-semibold tracking-wide">
              <th className="p-4 w-1/6">ID</th>
              <th className="p-4 w-1/5">Name</th>
              <th className="p-4 w-1/12">Age</th>
              <th className="p-4 w-1/6">State</th>
              <th className="p-4 w-1/5">Email</th>
              <th className="p-4 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-5 text-gray-500 text-center">
                  No data found
                </td>
              </tr>
            ) : (
              sorteddata.map((x) => (
                <tr
                  key={x._id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="p-3 truncate" title={x._id}>
                    {x._id}
                  </td>
                  {/* Rendering firstName and lastName combined */}
                  <td className="p-3">
                    {x.firstName} {x.lastName}
                  </td>
                  <td className="p-3">{x.age}</td>
                  {/* Replaced City with State */}
                  <td className="p-3">{x.state}</td>
                  <td className="p-3 truncate" title={x.email}>
                    {x.email}
                  </td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer active:scale-90 transition-transform duration-100 hover:-translate-y-0.5 mr-3"
                      onClick={() => navigate(`/viewdetails/${x._id}`)}
                    >
                      View Details
                    </button>

                    {/* Yeh raha tera naya Edit Button */}
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer active:scale-90 transition-transform duration-100 hover:-translate-y-0.5 mr-3"
                      onClick={() => navigate(`/edit/${x._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer active:scale-90 transition-transform duration-100 hover:-translate-y-0.5"
                      onClick={() => {
                        console.log("Deleting ID:", x._id);
                        dispatch(deleteUser(x._id));
                      }}
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
    </div>
  );
};

export default Home;
