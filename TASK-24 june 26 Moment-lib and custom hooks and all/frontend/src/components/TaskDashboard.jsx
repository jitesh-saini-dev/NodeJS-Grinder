import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/tasks/getAllTasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/tasks/task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/tasks/task/soft-delete/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Task Deleted Successfully!");

      fetchTasks();
    } catch (error) {
      console.log(error.response?.data);
      alert("Delete karne mein error aa gaya!");
    }
  };

  // Search
  const filteredTasks = tasks.filter(
    (task) =>
      task.taskName?.toLowerCase().includes(search.toLowerCase()) ||
      task.user_id?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      task.assignTo?.firstName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Task Dashboard</h1>

      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search Task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-96"
        />

        <button
          onClick={() => navigate("/form")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Create Task
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4">Task Name</th>

              <th className="p-4">Assigned By</th>

              <th className="p-4">Assigned To</th>

              <th className="p-4">Due Date</th>

              <th className="p-4">Status</th>

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5">
                  No Tasks Found
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task._id} className="border-b text-center">
                  <td className="p-3">{task.taskName}</td>

                  <td className="p-3">{task.user_id?.firstName}</td>

                  <td className="p-3">{task.assignTo?.firstName}</td>

                  <td className="p-3">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/viewtask/${task._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/edittask/${task._id}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete Task
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

export default TaskDashboard;
