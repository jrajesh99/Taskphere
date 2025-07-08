import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export default function CreateTaskModal({
  boardId,
  isOpen,
  onClose,
  onTaskCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "todo",
    due_date: "",
    labels: [],
    label_colors: {},
    assignee: [],
  });

  const [loading, setLoading] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [labelColor, setLabelColor] = useState("#000000");

  const [allUsers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/auth/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => Number(option.value));
    setFormData((prev) => ({ ...prev, assignee: selectedIds }));
  };

  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !formData.labels.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, trimmed],
        label_colors: {
          ...prev.label_colors,
          [trimmed]: labelColor,
        },
      }));
      setLabelInput("");
      setLabelColor("#000000");
    }
  };

  const removeLabel = (labelToRemove) => {
    const updatedLabels = formData.labels.filter(
      (label) => label !== labelToRemove
    );
    const updatedColors = { ...formData.label_colors };
    delete updatedColors[labelToRemove];
    setFormData((prev) => ({
      ...prev,
      labels: updatedLabels,
      label_colors: updatedColors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        board_id: boardId,
      };
      // Convert YYYY-MM-DD → YYYY-MM-DDT00:00:00 (or another desired time)
      if (formData.due_date) {
        payload.due_date = `${formData.due_date}T00:00:00`;
      }
      const res = await axios.post("tasks/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskCreated(res.data);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "todo",
        due_date: "",
        labels: [],
        label_colors: {},
        assignee: [],
      });
      onClose();
    } catch (err) {
      console.error("Task creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <input
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
          />

          {/* Multi-select Assignees */}
          <div>
            <label>Assignee(s):</label>
            <select
              multiple
              value={formData.assignee}
              onChange={handleAssigneeChange}
            >
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username || user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Labels */}
          <div>
            <label>Labels:</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Label name"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
              />
              <input
                type="color"
                value={labelColor}
                onChange={(e) => setLabelColor(e.target.value)}
              />
              <button type="button" onClick={handleAddLabel}>
                Add
              </button>
            </div>

            {formData.labels.map((label) => (
              <div
                key={label}
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    backgroundColor: formData.label_colors[label] || "#000",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  #{label}
                </span>
                <button type="button" onClick={() => removeLabel(label)}>
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
