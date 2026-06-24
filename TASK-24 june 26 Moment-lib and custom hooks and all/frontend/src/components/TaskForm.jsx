import { useEffect, useState } from "react";
import axios from "axios";

const TaskForm = () => {
  const [form, setForm] = useState({
    taskName: "",
    dueDate: "",
    assignTo: "",
    status: "pending",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

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
      console.log(error);
    }
  };

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

      const res = await axios.post(
        "http://localhost:3000/tasks/addtasks",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      alert("Task Created Successfully");

      setForm({
        taskName: "",
        dueDate: "",
        assignTo: "",
        status: "pending",
      });
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-5">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="taskName"
          placeholder="Task Name"
          value={form.taskName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select
          name="assignTo"
          value={form.assignTo}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="">Select User</option>

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>

        {/* <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select> */}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
