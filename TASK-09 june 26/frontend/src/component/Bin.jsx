import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInactiveData,
  restoreUser,
  permanentDeleteUser,
} from "../slice/userSlice";
import { useNavigate } from "react-router-dom";

const Bin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Slice se inactive data nikal rahe hain
  const inactiveUsers = useSelector((state) => state.users.inactiveData);

  useEffect(() => {
    dispatch(fetchInactiveData());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-10 text-center mt-5 text-gray-800">
          Recycle Bin
        </h1>

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
              {inactiveUsers?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-gray-500 text-center font-medium text-lg"
                  >
                    Trash is completely empty! 🗑️
                  </td>
                </tr>
              ) : (
                inactiveUsers?.map((x) => (
                  <tr
                    key={x._id}
                    className="text-center border-b hover:bg-red-50/40 transition"
                  >
                    <td className="p-3 truncate" title={x._id}>
                      {x._id}
                    </td>
                    <td className="p-3">
                      {x.firstName} {x.lastName}
                    </td>
                    <td className="p-3">{x.age}</td>
                    <td className="p-3">{x.state}</td>
                    <td className="p-3 truncate" title={x.email}>
                      {x.email}
                    </td>
                    <td className="p-3">
                      {/* Restore Button */}
                      <button
                        className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded shadow hover:bg-green-700 cursor-pointer active:scale-90 transition mr-3"
                        onClick={() => {
                          console.log("Restoring ID:", x._id);
                          dispatch(restoreUser(x._id));
                        }}
                      >
                        Restore
                      </button>

                      {/* Permanent Delete Button */}
                      <button
                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded shadow hover:bg-red-800 cursor-pointer active:scale-90 transition"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this user permanently? This cannot be undone.",
                            )
                          ) {
                            console.log("Permanently Deleting ID:", x._id);
                            dispatch(permanentDeleteUser(x._id));
                          }
                        }}
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
