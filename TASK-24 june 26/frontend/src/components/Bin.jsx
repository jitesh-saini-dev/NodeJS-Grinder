import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bin = () => {
  const navigate = useNavigate();

  const [inactiveTasks, setInactiveTasks] = useState([]);

  // Fetch Inactive Tasks
  const fetchInactiveTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/tasks/getInactiveAllTasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInactiveTasks(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInactiveTasks();
  }, []);

  // Restore Task
  const restoreTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "http://localhost:3000/tasks/restore",
        { _id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchInactiveTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Permanent Delete Task
  const permanentDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/tasks/permanent-delete?_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchInactiveTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-xl"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10">
          Task Recycle Bin
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {inactiveTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    Trash is Empty 🗑️
                  </td>
                </tr>
              ) : (
                inactiveTasks.map((task) => (
                  <tr key={task._id} className="text-center border-b">
                    <td className="p-3">{task.taskName}</td>

                    <td className="p-3">{task.status}</td>

                    <td className="p-3">
                      {task.assignTo?.firstName || "Unassigned"}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => restoreTask(task._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-3"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to permanently delete this task?",
                            )
                          ) {
                            permanentDeleteTask(task._id);
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
