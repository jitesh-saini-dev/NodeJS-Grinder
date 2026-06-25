import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useTheme from "./UseTheme";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    getMyTasks();
  }, []);

  async function getMyTasks() {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:3000/tasks/usertasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(res.data);
  }

  const getTaskBorderColor = (task) => {
    const dueDays = moment(task.dueDate).diff(moment(), "days");
    const isOverdue = moment(task.dueDate).isBefore(moment(), "day");

    if (
      (task.status === "pending" || task.status === "in progress") &&
      dueDays === 0
    ) {
      return "yellow";
    }

    if (task.status === "completed") {
      return "white";
    }

    if (task.status !== "completed" && dueDays > 0) {
      return "orange";
    }

    if (task.status !== "completed" && isOverdue) {
      return "red";
    }

    return "white";
  };

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:3000/tasks/update/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("Status Updated");
    getMyTasks();
  }

  const filteredTasks = tasks.filter((task) =>
    task.taskName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: theme === "dark" ? "#111" : "#f5f5f5",
        color: theme === "dark" ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>My Tasks</h1>

      {/* Top Buttons */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/taskform")}
          style={{
            padding: "10px 20px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 20px",
            backgroundColor: theme === "dark" ? "white" : "black",
            color: theme === "dark" ? "black" : "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Task Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "30px",
          borderRadius: "8px",
          border: "1px solid gray",
          backgroundColor: theme === "dark" ? "#333" : "white",
          color: theme === "dark" ? "white" : "black",
        }}
      />

      {filteredTasks.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                backgroundColor: theme === "dark" ? "#222" : "white",
                color: theme === "dark" ? "white" : "black",
                padding: "20px",
                borderRadius: "10px",
                border: `3px solid ${getTaskBorderColor(task)}`,
                boxShadow: "0px 0px 10px lightgray",
              }}
            >
              <h2>{task.taskName}</h2>

              <p>
                <b>Due Date:</b> {task.dueDate?.slice(0, 10)}
              </p>

              <p>
                <b>Assigned By:</b> {task.createdBy?.name}
              </p>

              <p>
                <b>Current Status:</b> {task.status}
              </p>

              <select
                onChange={(e) => updateStatus(task._id, e.target.value)}
                defaultValue={task.status}
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  width: "100%",
                  backgroundColor: theme === "dark" ? "#333" : "white",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      ) : (
        <h2 style={{ textAlign: "center" }}>No Tasks Found</h2>
      )}
    </div>
  );
}

export default MyTasks;
