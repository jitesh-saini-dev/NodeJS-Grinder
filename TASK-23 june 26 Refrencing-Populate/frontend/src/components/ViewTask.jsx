import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewTask = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const getTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/tasks/viewtask/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTask(res.data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  if (!task) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 bg-gray-200 px-4 py-2 rounded"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Task Details</h1>

        <div className="space-y-4">
          <p>
            <strong>Task Name:</strong> {task.taskName}
          </p>

          <p>
            <strong>Assigned By:</strong> {task.user_id?.firstName}
            {task.user_id?.lastName}
          </p>

          <p>
            <strong>Assigned To:</strong> {task.assignTo?.firstName}
            {task.assignTo?.lastName}
          </p>

          <p>
            <strong>Email:</strong> {task.assignTo?.email}
          </p>

          <p>
            <strong>Due Date:</strong>
            {new Date(task.dueDate).toLocaleDateString()}
          </p>

          <p>
            <strong>Status:</strong> <span>{task.status}</span>
          </p>

          <p>
            <strong>Created At:</strong>{" "}
            {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
