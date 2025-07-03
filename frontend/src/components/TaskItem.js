import { Draggable } from "@hello-pangea/dnd";

export default function TaskItem({
  task,
  index,
  handleStatusChange,
  handleEdit,
  handleDelete,
}) {
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
          <strong>{task.title}</strong>{" "}
          {task.priority && (
            <span
              style={{
                backgroundColor:
                  task.priority === "High"
                    ? "#dc3545"
                    : task.priority === "Medium"
                    ? "#ffc107"
                    : "#28a745",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                marginLeft: "8px",
              }}
            >
              {task.priority}
            </span>
          )}
          <div>{task.description}</div>
          {task.due_date && (
            <div style={{ fontSize: "0.85rem" }}>
              📅 Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
          <div style={{ marginTop: "6px" }}>
            {task.labels &&
              task.labels.map((label, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    marginRight: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  #{label}
                </span>
              ))}
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
            <button onClick={() => handleEdit(task)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: "5px", color: "red" }}
            >
              Delete
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
}
