import { Draggable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import CommentSection from "./CommentSection";
import TaskActivityLog from "./TaskActivityLog";

export default function TaskItem({
  task,
  index,
  handleStatusChange,
  handleEdit,
  handleDelete,
  taskQuery,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      );
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#ffffff";
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            backgroundColor: snapshot.isDragging ? "#e0f7fa" : "#f9f9f9",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
            boxShadow: snapshot.isDragging
              ? "0 2px 8px rgba(0,0,0,0.2)"
              : "none",
            ...provided.draggableProps.style,
          }}
        >
          <strong>{highlightMatch(task.title, taskQuery)}</strong>{" "}
          {task.priority && (
            <span
              style={{
                backgroundColor:
                  task.priority === "High"
                    ? "#dc3545"
                    : task.priority === "Medium"
                    ? "#ffc107"
                    : "#28a745",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                marginLeft: "8px",
              }}
            >
              {task.priority}
            </span>
          )}
          <div>{highlightMatch(task.description, taskQuery)}</div>
          {task.due_date && (
            <div style={{ fontSize: "0.85rem" }}>
              📅 Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
          <div style={{ marginTop: "6px" }}>
            {task.labels &&
              task.labels.map((label, i) => {
                const bgColor = task.label_colors?.[label] || "#e0e0e0";
                const textColor = getContrastColor(bgColor);

                return (
                  <span
                    key={i}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderRadius: "4px",
                      padding: "2px 6px",
                      marginRight: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    #{label}
                  </span>
                );
              })}
          </div>
          <div style={{ marginTop: "8px" }}>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button
              type="button"
              onClick={() => handleEdit(task)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: "5px", color: "red" }}
            >
              Delete
            </button>
            <button
              onClick={() => setShowComments((prev) => !prev)}
              style={{ marginTop: "5px", fontSize: "14px", color: "#0984e3" }}
            >
              💬 Comments
            </button>
            <button
              onClick={() => setShowLogs((prev) => !prev)}
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#2d3436",
                marginLeft: "8px",
              }}
            >
              📜 Logs
            </button>
            {showComments && (
              <CommentSection
                taskId={task.id}
                onClose={() => setShowComments(false)}
              />
            )}
            {showLogs && (
              <TaskActivityLog
                taskId={task.id}
                searchTerm={taskQuery}
                onClose={() => setShowLogs(false)}
              />
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}
