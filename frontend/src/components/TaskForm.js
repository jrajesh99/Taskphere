import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig"; 

const TaskForm = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ assignees: [] });

  useEffect(() => {
    // Fetch users to populate assignee list
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/auth/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate,
      labels: labels.split(",").map((label) => label.trim()),
      board_id: boardId,
      assignees: formData.assignees,
    };

    try {
      const response = await axios.post("tasks/", taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Task created:", response.data);
      onTaskCreated(response.data);

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("Medium");
      setDueDate("");
      setLabels("");
      setFormData({ assignees: [] });
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create New Task</h3>
      <div>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label>Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label>Labels (comma-separated):</label>
        <input
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
        />
      </div>

      <div>
        <label>Assignees:</label>
        <select
          multiple
          value={formData.assignees}
          onChange={(e) =>
            setFormData({
              ...formData,
              assignees: Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              ),
            })
          }
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
