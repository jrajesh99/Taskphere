import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import TaskForm from "./TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [filterStatus, setFilterStatus] = useState("all");

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
        "tasks/",
        {
          id: taskId,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    try {
      await handleStatusChange(draggableId, destination.droppableId);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  if (loading) return <p>Loading boards and tasks...</p>;

  return (
    <div>
      <h2>Boards</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        {boards.map((board) => (
          <div
            key={board.id}
            style={{
              border: "1px solid #ccc",
              margin: "20px 0",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{board.title}</h3>
            <p>{board.description}</p>

            <div style={{ marginBottom: "20px" }}>
              <label>Filter Tasks: </label>
              {["all", "todo", "in-progress", "done"].map((status) => (
                <button
                  key={`${board.id}-${status}`}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor:
                      filterStatus === status ? "#007bff" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>

            {["todo", "in-progress", "done"].map((status) => (
              <Droppable droppableId={status} key={`${board.id}-${status}`} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ marginBottom: "15px" }}
                  >
                    <h4>{status.toUpperCase()}</h4>
                    <ul>
                      {(tasks[board.id] || [])
                        .filter(
                          (task) =>
                            filterStatus === "all" ||
                            task.status === filterStatus
                        )
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            draggableId={task.id.toString()}
                            index={index}
                            key={task.id}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <strong>{task.title}</strong>:{" "}
                                {task.description}
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleStatusChange(task.id, e.target.value)
                                  }
                                  style={{ marginLeft: "10px" }}
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in-progress">
                                    In Progress
                                  </option>
                                  <option value="done">Done</option>
                                </select>
                                <button
                                  onClick={() => handleEdit(task)}
                                  style={{ marginLeft: "10px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  style={{ marginLeft: "5px", color: "red" }}
                                >
                                  Delete
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}

            <TaskForm boardId={board.id} />
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
