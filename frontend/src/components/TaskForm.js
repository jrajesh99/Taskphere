import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

const TaskForm = ({ boardId, onTaskCreated, onTaskUpdated, taskToEdit  }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ assignees: [] });
  const [labelColors, setLabelColors] = useState({});
  const [newLabel, setNewLabel] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");

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

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "todo");
      setPriority(taskToEdit.priority || "Medium");
      setDueDate(taskToEdit.due_date?.slice(0, 10) || "");
      setLabels(taskToEdit.labels?.join(",") || "");
      setLabelColors(taskToEdit.label_colors || {});
      setFormData({ assignees: taskToEdit.assignees || [] });
    }
  }, [taskToEdit]);

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
      label_colors: labelColors,
      board_id: boardId,
      assignees: formData.assignees,
    };

    try {
      const url = taskToEdit ? `tasks/${taskToEdit.id}/` : "tasks/";
      const method = taskToEdit ? "put" : "post";

      const response = await axios[method](url, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Task created:", response.data);
      if (taskToEdit) {
        onTaskUpdated(response.data); // pass updated task to parent
      } else {
        onTaskCreated(response.data);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("Medium");
      setDueDate("");
      setLabels("");
      setLabels([]);
      setLabelColors({});
      setNewLabel("");
      setNewLabelColor("#000000");
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
        <label>Add Label:</label>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Label name"
        />
        <input
          type="color"
          value={newLabelColor}
          onChange={(e) => setNewLabelColor(e.target.value)}
          style={{ marginLeft: "5px" }}
        />
        <button
          type="button"
          onClick={() => {
            if (!newLabel.trim() || labels.includes(newLabel.trim())) return;
            setLabels([...labels, newLabel.trim()]);
            setLabelColors({
              ...labelColors,
              [newLabel.trim()]: newLabelColor,
            });
            setNewLabel("");
            setNewLabelColor("#000000");
          }}
          style={{ marginLeft: "5px" }}
        >
          Add
        </button>
      </div>

      {labels.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Labels:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {labels.map((label) => (
              <span
                key={label}
                style={{
                  backgroundColor: labelColors[label] || "#ddd",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {label}
                <button
                  onClick={() => {
                    setLabels(labels.filter((l) => l !== label));
                    const updatedColors = { ...labelColors };
                    delete updatedColors[label];
                    setLabelColors(updatedColors);
                  }}
                  style={{
                    marginLeft: "5px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label>Assignees:</label>
        <select
          multiple
          value={formData.assignees}
          onChange={(e) =>
            setFormData({
              ...formData,
              assignees: Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
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
