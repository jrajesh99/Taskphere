import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";

const statuses = ["todo", "in-progress", "done"];

export default function BoardCard({
  board,
  tasks,
  filterStatus,
  setFilterStatus,
  taskQuery,
  handleStatusChange,
  handleEdit,
  handleDelete,
}) {
  return (
    <div
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
        {["all", ...statuses].map((status) => (
          <button
            key={`${board.id}-${status}`}
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

      {statuses.map((status) => (
        <TaskColumn
          key={`${board.id}-${status}`}
          boardId={board.id}
          status={status}
          tasks={tasks}
          filterStatus={filterStatus}
          taskQuery={taskQuery}
          handleStatusChange={handleStatusChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}

      <TaskForm
        boardId={board.id}
        onTaskCreated={(newTask) => {
            console.log("New task created:", newTask);
        }}
      />
    </div>
  );
}
