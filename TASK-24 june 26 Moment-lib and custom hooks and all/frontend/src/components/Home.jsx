import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useViewToggle from "../hooks/useViewToggle";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { HiOutlineTableCells } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";

import moment from "moment";
import Header from "./Header";

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
      const res = await axios.get("http://localhost:3000/users/getSignupUser", {
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

  //PDF Download
  const downloadPDF = async (taskId, taskName) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3000/tasks/download-report/${taskId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${taskName.replace(/\s+/g, "_")}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to download PDF");
    }
  };

  //listen
  const speakTask = (task) => {
    const speech = new SpeechSynthesisUtterance(
      `Task name ${task.taskName}.
    Status ${task.status}.
    Due date ${new Date(task.dueDate).toLocaleDateString()}`,
    );

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  // Search
  const filteredTasks = tasks.filter(
    (task) =>
      task.taskName?.toLowerCase().includes(search.toLowerCase()) ||
      task.user_id?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      task.assignTo?.firstName?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <Header />
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
                        <td
                          colSpan="5"
                          className="text-center p-8 text-gray-500"
                        >
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
                            <span
                              className={`px-3 py-1 rounded-full ${
                                task.status !== "completed" &&
                                moment(task.dueDate).isBefore(moment(), "day")
                                  ? "bg-red-500 text-white font-semibold"
                                  : task.status !== "completed" &&
                                      moment(task.dueDate).isSame(
                                        moment(),
                                        "day",
                                      )
                                    ? "bg-yellow-300 text-black font-semibold"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "N/A"}
                            </span>
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

                          <td className="p-4 border-b">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/viewtask/${task._id}`)
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                              >
                                View
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/edittask/${task._id}`)
                                }
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
                              <button
                                onClick={() =>
                                  downloadPDF(task._id, task.taskName)
                                }
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300"
                              >
                                Download
                              </button>

                              <button
                                onClick={() => speakTask(task)}
                                className="bg-orange-500 text-white px-3 py-2 rounded-lg"
                              >
                                🔊 Listen
                              </button>
                            </div>
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
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Task Name */}
                      <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
                        {task.taskName}
                      </h2>

                      {/* Assigned To */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-600">
                          Assigned To
                        </span>

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {task.assignTo?.firstName} {task.assignTo?.lastName}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-600">
                          Due Date
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            task.status !== "completed" &&
                            moment(task.dueDate).isBefore(moment(), "day")
                              ? "bg-red-500 text-white"
                              : task.status !== "completed" &&
                                  moment(task.dueDate).isSame(moment(), "day")
                                ? "bg-yellow-300 text-yellow-900"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-semibold text-gray-600">
                          Status
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                            task.status === "completed"
                              ? "bg-green-500"
                              : task.status === "in progress"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {task.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/viewtask/${task._id}`)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/edittask/${task._id}`)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => downloadPDF(task._id, task.taskName)}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Download
                        </button>

                        <button
                          onClick={() => speakTask(task)}
                          className="bg-orange-500 text-white px-3 py-2 rounded-lg"
                        >
                          🔊 Listen
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
                        <td
                          colSpan="5"
                          className="text-center p-8 text-gray-500"
                        >
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
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                moment(task.dueDate).isBefore(
                                  moment(),
                                  "day",
                                ) && task.status !== "completed"
                                  ? "bg-red-300 text-red-900"
                                  : moment(task.dueDate).isSame(
                                        moment(),
                                        "day",
                                      ) && task.status !== "completed"
                                    ? "bg-yellow-300 text-black"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {task.dueDate
                                ? moment(task.dueDate).format("DD MMM YYYY")
                                : "N/A"}
                            </span>
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
                            {/* <button
                            onClick={() => navigate(`/edittask/${task._id}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            Edit
                          </button> */}

                            {/* CONDITION LAGA DI HAI KI COMPLETED HAI TOH DISABLED RAHEGA */}
                            <button
                              onClick={() => {
                                if (task.status !== "completed") {
                                  navigate(`/edittask/${task._id}`);
                                }
                              }}
                              disabled={task.status === "completed"}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                task.status === "completed"
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
                              }`}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(task._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                            >
                              Delete
                            </button>

                            <button
                              onClick={() =>
                                downloadPDF(task._id, task.taskName)
                              }
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300"
                            >
                              Download
                            </button>

                            <button
                              onClick={() => speakTask(task)}
                              className="bg-orange-500 text-white px-3 py-2 rounded-lg"
                            >
                              🔊 Listen
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
                    <div className="col-span-full text-center text-gray-500 text-lg font-medium">
                      No Data Found! No tasks assigned yet. Enjoy 🎉
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-2"
                      >
                        {/* Task Name */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
                          {task.taskName}
                        </h2>

                        {/* Assigned By */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-600">
                            Assigned By
                          </span>

                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {task.user_id?.firstName} {task.user_id?.lastName}
                          </span>
                        </div>

                        {/* Due Date */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-600">
                            Due Date
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              task.status !== "completed" &&
                              moment(task.dueDate).isSame(moment(), "day")
                                ? "bg-yellow-300 text-yellow-900"
                                : task.status !== "completed" &&
                                    moment(task.dueDate).isBefore(
                                      moment(),
                                      "day",
                                    )
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-semibold text-gray-600">
                            Status
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                              task.status === "completed"
                                ? "bg-green-500"
                                : task.status === "in progress"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          >
                            {task.status?.toUpperCase()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/viewtask/${task._id}`)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all"
                          >
                            View
                          </button>

                          {/* <button
                          onClick={() => navigate(`/edittask/${task._id}`)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Edit
                        </button> */}

                          {/* SAME CONDITION CARD VIEW KE BUTTON PE */}
                          <button
                            onClick={() => {
                              if (task.status !== "completed") {
                                navigate(`/edittask/${task._id}`);
                              }
                            }}
                            disabled={task.status === "completed"}
                            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                              task.status === "completed"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                            }`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(task._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => downloadPDF(task._id, task.taskName)}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition-all"
                          >
                            Download
                          </button>

                          <button
                            onClick={() => speakTask(task)}
                            className="bg-orange-500 text-white px-3 py-2 rounded-lg"
                          >
                            🔊 Listen
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

      {/* Floating Calendar Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* Tooltip */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg">
          Task Calendar
        </div>

        <button
          onClick={() => navigate("/task-calendar")}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-4 border-white"
        >
          <FaCalendarAlt size={28} />
        </button>
      </div>
    </>
  );
};

export default Home;
