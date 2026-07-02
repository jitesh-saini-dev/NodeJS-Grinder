import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useViewToggle from "../hooks/useViewToggle";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { HiOutlineTableCells } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";

import moment from "moment";
import Header from "./Header";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { view, toggleView } = useViewToggle();

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
      if (error.response?.status === 403) {
        toast.error(error.response.data.message, {
          toastId: "admin-error",
        });

        navigate("/");
      }
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

  // PDF download
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

      link.setAttribute("download", `${taskName}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <span className="text-2xl leading-none">+</span> Create Task
          </button>

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

        {view === "table" ? (
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
                        <span
                          className={`px-3 py-2 rounded-3xl ${
                            task.status !== "completed" &&
                            moment(task.dueDate).isSame(moment(), "day")
                              ? "bg-yellow-300 text-black font-semibold"
                              : task.status !== "completed" &&
                                  moment(task.dueDate).isBefore(moment(), "day")
                                ? "bg-red-500 text-white font-semibold"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
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
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/viewtask/${task._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/edittask/${task._id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
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
                            onClick={() => downloadPDF(task._id, task.taskName)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:-translate-y-2 p-6"
              >
                {/* Title */}
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {task.taskName}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-gray-700">
                  <p className="flex justify-between">
                    <span className="font-semibold">Assigned By</span>
                    <span>{task.user_id?.firstName}</span>
                  </p>

                  <p className="flex justify-between">
                    <span className="font-semibold">Assigned To</span>
                    <span>{task.assignTo?.firstName}</span>
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Due Date</span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        task.status !== "completed" &&
                        moment(task.dueDate).isSame(moment(), "day")
                          ? "bg-yellow-300 text-black"
                          : task.status !== "completed" &&
                              moment(task.dueDate).isBefore(moment(), "day")
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {moment(task.dueDate).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t my-5"></div>

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

export default TaskDashboard;
