import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";
import CreateTaskModal from "./CreateTaskModal";
import { useState } from "react";

const statuses = ["todo", "in-progress", "done"];

export default function BoardCard({
  board,
  tasks,
  filterStatus,
  setFilterStatus,
  taskQuery,
  handleStatusChange,
  handleEdit,
  handleTaskCreated,
  handleDelete,
  
}) {
  const [filterPriority, setFilterPriority] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [filterLabel, setFilterLabel] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [setTasks] = useState({});
  const handleTaskEdit = handleEdit;

  const uniqueLabels = Array.from(
    new Set(tasks.flatMap((task) => task.labels || []))
  );

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

      {/* Label Filter */}
      {uniqueLabels.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <label>Filter by Label: </label>
          {uniqueLabels.map((label) => (
            <button
              key={label}
              onClick={() =>
                setFilterLabel((prev) => (prev === label ? null : label))
              }
              style={{
                margin: "0 5px 5px 0",
                padding: "4px 10px",
                backgroundColor: filterLabel === label ? "#6c5ce7" : "#dfe6e9",
                color: filterLabel === label ? "white" : "#2d3436",
                border: "none",
                borderRadius: "6px",
              }}
            >
              #{label}
            </button>
          ))}
        </div>
      )}

      {/* Status Filter */}
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

      {/* Priority Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>Priority: </label>
        {["all", "High", "Medium", "Low"].map((level) => (
          <button
            key={level}
            onClick={() => setFilterPriority(level)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: filterPriority === level ? "#28a745" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Due Date Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>Due Date: </label>
        {["all", "overdue", "today", "upcoming"].map((type) => (
          <button
            key={type}
            onClick={() => setDueDateFilter(type)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: dueDateFilter === type ? "#6f42c1" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Sort Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>Sort By: </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            marginLeft: "8px",
          }}
        >
          <option value="none">None</option>
          <option value="due-date-asc">Due Date ↑</option>
          <option value="due-date-desc">Due Date ↓</option>
          <option value="priority-asc">Priority ↑</option>
          <option value="priority-desc">Priority ↓</option>
        </select>
      </div>

      {/* Create Task */}
      <button
        onClick={() => setShowCreateModal(true)}
        style={{
          backgroundColor: "#00b894",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          marginTop: "10px",
        }}
      >
        + New Task
      </button>

      {/* Task Modal */}
      <CreateTaskModal
        boardId={board.id}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Task Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {statuses.map((status) => (
          <TaskColumn
            key={`${board.id}-${status}`}
            boardId={board.id}
            status={status}
            tasks={tasks}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            dueDateFilter={dueDateFilter}
            taskQuery={taskQuery}
            handleStatusChange={handleStatusChange}
            handleEdit={handleTaskEdit}
            handleDelete={handleDelete}
            sortBy={sortBy}
            filterLabel={filterLabel}
          />
        ))}
      </div>
    </div>
  );
}
