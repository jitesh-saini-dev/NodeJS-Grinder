import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useViewToggle from "../hooks/useViewToggle";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { HiOutlineTableCells } from "react-icons/hi2";

const Home = () => {
  const [search, setSearch] = useState("");

  // UI States
  const [activeTab, setActiveTab] = useState("assignBy");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data States
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Form State
  const [form, setForm] = useState({
    taskName: "",
    dueDate: "",
    assignTo: "",
    status: "pending",
  });

  const navigate = useNavigate();
  const { view, toggleView } = useViewToggle();

  // --- API Calls ---

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/tasks/getSignupUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.log("Fetch Users Error:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        activeTab === "assignBy"
          ? "http://localhost:3000/tasks/createdAllTasks"
          : "http://localhost:3000/tasks/assignedTasks";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.data || []);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.info(error.response.data.message, {
          toastId: "admin-assigned-tasks",
        });

        return;
      }

      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  // --- Actions Handlers (View, Edit navigate karenge, Delete yahi hoga) ---

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/tasks/task/soft-delete/${taskId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Task Deleted Successfully!");
      fetchTasks(); // Delete hone ke baad list refresh kar do
    } catch (error) {
      console.log("Delete Error:", error.response?.data);
      alert("Delete karne mein error aa gaya!");
    }
  };

  // --- Form Handlers (Modal ke liye) ---

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/tasks/addtasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Task Created Successfully");
      setForm({ taskName: "", dueDate: "", assignTo: "", status: "pending" });
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.log("Create Task Error:", error.response?.data);
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
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          User Task Dashboard
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <span className="text-2xl leading-none">+</span> New Task
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab("assignBy")}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === "assignBy"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Assigned By Me
          </button>

          <button
            onClick={() => setActiveTab("assignTo")}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === "assignTo"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Assigned To Me
          </button>

          <input
            type="text"
            placeholder="Search Task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-96 ml-110"
          />

          <button
            onClick={toggleView}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            {view === "table" ? (
              <>
                <BsGrid3X3GapFill size={20} />
              </>
            ) : (
              <>
                <HiOutlineTableCells size={20} />
              </>
            )}
          </button>
        </div>

        {/* Task Tables */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          {/* ---- TABLE 1: ASSIGNED BY ME ---- */}
          {activeTab === "assignBy" &&
            (view === "table" ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-indigo-50 text-gray-700">
                  <tr>
                    <th className="p-4 border-b">Task Name</th>
                    <th className="p-4 border-b">Due Date</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Assigned To</th>
                    <th className="p-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-gray-500">
                        No Data Found!. You have not assigned any tasks to
                        anyone yet.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 border-b font-medium text-gray-800">
                          {task.taskName}
                        </td>
                        <td className="p-4 border-b text-gray-600">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4 border-b">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {task.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td className="p-4 border-b text-gray-600">
                          {task.assignTo?.firstName} {task.assignTo?.lastName}
                        </td>
                        <td className="p-4 border-b flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/viewtask/${task._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/edittask/${task._id}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-xl shadow-lg p-5 border"
                  >
                    <h2 className="text-2xl font-bold mb-4">{task.taskName}</h2>

                    <p>
                      <strong>Assigned To:</strong> {task.assignTo?.firstName}{" "}
                      {task.assignTo?.lastName}
                    </p>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>

                    <p className="mb-4">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/viewtask/${task._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => navigate(`/edittask/${task._id}`)}
                        className="bg-green-500 text-white px-3 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* ---- TABLE 2: ASSIGNED TO ME ---- */}
          {activeTab === "assignTo" &&
            (view === "table" ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-indigo-50 text-gray-700">
                  <tr>
                    <th className="p-4 border-b">Task Name</th>
                    <th className="p-4 border-b">Due Date</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Assigned By</th>
                    <th className="p-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-gray-500">
                        No Data Found!. No tasks assigned yet. Enjoy!
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 border-b font-medium text-gray-800">
                          {task.taskName}
                        </td>
                        <td className="p-4 border-b text-gray-600">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4 border-b">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {task.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td className="p-4 border-b text-gray-600">
                          {task.user_id?.firstName} {task.user_id?.lastName}
                        </td>
                        <td className="p-4 border-b flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/viewtask/${task._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/edittask/${task._id}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              // CARD VIEW
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredTasks.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">
                    No Data Found!. No tasks assigned yet. Enjoy!
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white rounded-xl shadow-lg p-5 border"
                    >
                      <h2 className="text-2xl font-bold mb-4">
                        {task.taskName}
                      </h2>

                      <p>
                        <strong>Assigned By:</strong> {task.user_id?.firstName}{" "}
                        {task.user_id?.lastName}
                      </p>

                      <p>
                        <strong>Due Date:</strong>{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <p className="mb-4">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            task.status === "completed"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {task.status?.toUpperCase()}
                        </span>
                      </p>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/viewtask/${task._id}`)}
                          className="bg-blue-500 text-white px-3 py-2 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() => navigate(`/edittask/${task._id}`)}
                          className="bg-green-500 text-white px-3 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
      </div>

      {/* --- MODAL W/ FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Create New Task
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-3xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="taskName"
                placeholder="Task Name"
                value={form.taskName}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <select
                name="assignTo"
                value={form.assignTo}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
