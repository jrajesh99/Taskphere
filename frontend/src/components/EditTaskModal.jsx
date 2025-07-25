import { useState, useEffect } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
    due_date: "",
    labels: [],
    label_colors: {},
  });

  const [newLabel, setNewLabel] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date?.split("T")[0],
        labels: task.labels || [],
        label_colors: task.label_colors || {},
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

  const handleAddLabel = () => {
    const trimmed = newLabel.trim();
    if (trimmed && !formData.labels.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, trimmed],
        label_colors: {
          ...prev.label_colors,
          [trimmed]: newLabelColor,
        },
      }));
      setNewLabel("");
      setNewLabelColor("#000000");
    }
  };

  const handleDeleteLabel = (label) => {
    const updatedLabels = formData.labels.filter((l) => l !== label);
    const updatedColors = { ...formData.label_colors };
    delete updatedColors[label];
    setFormData((prev) => ({
      ...prev,
      labels: updatedLabels,
      label_colors: updatedColors,
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
          width: "350px",
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

        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label"
            style={{ flex: 2 }}
          />
          <input
            type="color"
            value={newLabelColor}
            onChange={(e) => setNewLabelColor(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={handleAddLabel}>
            Add
          </button>
        </div>

        {formData.labels.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Labels:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {formData.labels.map((label) => (
                <span
                  key={label}
                  style={{
                    backgroundColor: formData.label_colors[label] || "#888",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {label}
                  <button
                    onClick={() => handleDeleteLabel(label)}
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
