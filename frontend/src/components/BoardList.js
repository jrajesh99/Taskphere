import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { DragDropContext } from "@hello-pangea/dnd";
import BoardCard from "./BoardCard";
import EditTaskModal from "./EditTaskModal";

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [filterStatus, setFilterStatus] = useState("all");
  const [taskQuery, setTaskQuery] = useState("");
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

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
      await axios.patch(
        `tasks/${taskId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  
  const handleEdit = (task) => {
    setTaskBeingEdited(task);
  };

  const handleSaveEdit = async (updatedTask) => {
    try {
      await axios.put(`tasks/${updatedTask.id}/`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTasks = { ...tasks };
      const boardId = boards.find((board) =>
        (tasks[board.id] || []).some((t) => t.id === updatedTask.id)
      )?.id;

      if (boardId) {
        const taskRes = await axios.get(`tasks/?board=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedTasks[boardId] = taskRes.data;
      }

      setTasks(updatedTasks);
      setTaskBeingEdited(null);
    } catch (err) {
      console.error("Error updating task:", err);
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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const [, destStatus] = destination.droppableId.split("-");
    try {
      await handleStatusChange(draggableId, destStatus);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  if (loading) return <p>Loading boards and tasks...</p>;

  return (
    <div>
      <h2>Boards</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={taskQuery}
          onChange={(e) => setTaskQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            tasks={tasks[board.id] || []}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            taskQuery={taskQuery}
            handleStatusChange={handleStatusChange}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleTaskCreated={(newTask) => {
              setTasks((prev) => {
                const updated = { ...prev };
                updated[board.id] = [...(updated[board.id] || []), newTask];
                return updated;
              });
            }}
          />
        ))}
      </DragDropContext>
      {taskBeingEdited && (
        <EditTaskModal
          task={taskBeingEdited}
          onSave={handleSaveEdit}
          onClose={() => setTaskBeingEdited(null)}
        />
      )}
    </div>
  );
}
