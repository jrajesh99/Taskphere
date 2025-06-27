import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import TaskForm from "./TaskForm";

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBoardsAndTasks = async () => {
      try {
        const boardRes = await axios.get("boards/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(boardRes.data);

        const taskMap = {};
        for (let board of boardRes.data) {
          const taskRes = await axios.get(`tasks/?board=${board.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          taskMap[board.id] = taskRes.data;
        }

        setTasks(taskMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching boards or tasks:", err);
      }
    };

    fetchBoardsAndTasks();
  }, [token]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `tasks/${taskId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Reload tasks
      const updatedTasks = { ...tasks };
      for (let boardId in updatedTasks) {
        const taskRes = await axios.get(`tasks/?board=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedTasks[boardId] = taskRes.data;
      }
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleEdit = async (task) => {
    const newTitle = prompt("Edit title", task.title);
    const newDesc = prompt("Edit description", task.description);

    if (newTitle !== null && newDesc !== null) {
      try {
        await axios.put(
          `tasks/${task.id}/`,
          {
            title: newTitle,
            description: newDesc,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const filterTasks = (taskList) => {
    if (filterStatus === "all") return taskList;
    return taskList.filter((task) => task.status === filterStatus);
  };

  if (loading) return <p>Loading boards and tasks...</p>;

  return (
    <div>
      <h2>Boards</h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <label>Filter Tasks: </label>
        {["all", "todo", "in-progress", "done"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: filterStatus === status ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {boards.map((board) => (
        <div
          key={board.id}
          style={{
            border: "1px solid #ccc",
            margin: "20px 0",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{board.title}</h3>
          <p>{board.description}</p>

          <h4>Tasks</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {filterTasks(tasks[board.id] || []).map((task) => (
              <li key={task.id} style={{ marginBottom: "8px" }}>
                <strong>{task.title}</strong> - {task.description}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{ marginLeft: "10px" }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => handleEdit(task)}
                  style={{ marginLeft: "10px" }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <TaskForm boardId={board.id} />
        </div>
      ))}
    </div>
  );
}
