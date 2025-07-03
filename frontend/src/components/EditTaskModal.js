import { useState, useEffect } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
    due_date: "",
    labels: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date?.split("T")[0],
        labels: task.labels || [],
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLabelChange = (e) => {
    const labels = e.target.value.split(",").map((l) => l.trim());
    setFormData((prev) => ({
      ...prev,
      labels,
    }));
  };

  const handleSubmit = () => {
    onSave({ ...formData, id: task.id });
  };

  if (!task) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h3>Edit Task</h3>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          placeholder="Comma separated labels"
          value={formData.labels.join(", ")}
          onChange={handleLabelChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose} style={{ backgroundColor: "#ccc" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
