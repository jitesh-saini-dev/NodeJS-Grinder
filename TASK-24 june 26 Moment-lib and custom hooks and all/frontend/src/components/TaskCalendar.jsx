// import { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const TaskCalendar = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     getTasks();
//   }, []);

//   const getTasks = async () => {
//     try {
//       const result = await axios.get(
//         "http://localhost:3000/tasks/calendarTasks",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       console.log("API Response:", result.data);
//       console.log(result.data.data[0]); // <-- Yaha lagao

//       setTasks(result.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     console.log("Tasks State:", tasks);
//   }, [tasks]);

//   const filteredTasks = tasks.filter((task) => {
//     console.log(
//       "Task Date:",
//       new Date(task.dueDate).toDateString(),
//       "Selected Date:",
//       selectedDate.toDateString(),
//     );

//     return (
//       new Date(task.dueDate).toDateString() === selectedDate.toDateString()
//     );
//   });

//   console.log("Filtered Tasks:", filteredTasks);

//   const hasTask = (date) => {
//     return tasks.some(
//       (task) => new Date(task.dueDate).toDateString() === date.toDateString(),
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h1 className="text-3xl font-bold mb-5">Task Calendar</h1>

//         <DatePicker
//           inline
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           renderDayContents={(day, date) => (
//             <div className="relative w-full h-full flex flex-col items-center justify-center">
//               <span>{day}</span>

//               {hasTask(date) && (
//                 <span className="text-red-500 text-[10px] leading-none">•</span>
//               )}
//             </div>
//           )}
//         />
//       </div>

//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">
//           Tasks for {selectedDate.toDateString()}
//         </h2>

//         {filteredTasks.length > 0 ? (
//           filteredTasks.map((task) => (
//             <div
//               key={task._id}
//               className="bg-white shadow rounded-xl p-5 mb-4 border"
//             >
//               <h3 className="text-xl font-semibold">{task.taskName}</h3>

//               <p className="mt-2">
//                 <strong>Assigned By:</strong>{" "}
//                 {task.assignedBy?.firstName || "N/A"}
//               </p>

//               <p>
//                 <strong>Assigned To:</strong>{" "}
//                 {task.assignTo?.firstName || "N/A"}
//               </p>

//               <p>
//                 <strong>Status:</strong> {task.status}
//               </p>

//               <p>
//                 <strong>Due Date:</strong>{" "}
//                 {new Date(task.dueDate).toLocaleDateString()}
//               </p>
//             </div>
//           ))
//         ) : (
//           <div className="bg-white rounded-xl p-5 shadow text-gray-500">
//             No tasks found for this date.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default TaskCalendar;

import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { HiOutlineTableCells } from "react-icons/hi2";
import Header from "./Header";

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("table");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/tasks/calendarTasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTasks(result.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      new Date(task.dueDate).toDateString() === selectedDate.toDateString(),
  );

  const hasTask = (date) => {
    return tasks.some(
      (task) => new Date(task.dueDate).toDateString() === date.toDateString(),
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
          {" "}
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">
                Task Calendar
              </h1>

              <p className="text-gray-500 mt-1">Track tasks by due date</p>
            </div>
          </div>
          <button
            onClick={() => setView(view === "table" ? "card" : "table")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            {view === "table" ? (
              <BsGrid3X3GapFill size={20} />
            ) : (
              <HiOutlineTableCells size={20} />
            )}
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mt-15">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="w-fit mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-5">
              <DatePicker
                inline
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                renderDayContents={(day, date) => (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <span>{day}</span>

                    {hasTask(date) && (
                      <span className="text-red-500 text-xs leading-none">
                        ●
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Tasks for {selectedDate.toLocaleDateString()}
              </h2>

              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
                {filteredTasks.length} Tasks
              </span>
            </div>

            {/* TABLE VIEW */}
            {view === "table" ? (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-indigo-50 text-gray-700">
                    <tr>
                      <th className="p-5">Task Name</th>
                      <th className="p-5">Assigned By</th>
                      <th className="p-5">Assigned To</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Due Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <tr
                          key={task._id}
                          className="border-t hover:bg-gray-50 transition-all"
                        >
                          <td className="p-5 font-semibold text-gray-800">
                            {task.taskName}
                          </td>

                          <td className="p-5">
                            {task.assignedBy?.firstName || "N/A"}
                          </td>

                          <td className="p-5">
                            {task.assignTo?.firstName || "N/A"}
                          </td>

                          <td className="p-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {task.status.toUpperCase()}
                            </span>
                          </td>

                          <td className="p-5">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center p-12 text-gray-500"
                        >
                          No tasks found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-2"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
                        {task.taskName}
                      </h2>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">
                            Assigned By
                          </span>

                          <span>{task.assignedBy?.firstName || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">
                            Assigned To
                          </span>

                          <span>{task.assignTo?.firstName || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">
                            Due Date
                          </span>

                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            Status
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-3xl shadow-lg p-12 text-center text-gray-500">
                    No tasks found for this date.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCalendar;
