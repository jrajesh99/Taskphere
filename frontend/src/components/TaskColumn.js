import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

export default function TaskColumn({
  boardId,
  status,
  tasks,
  filterStatus,
  taskQuery,
  handleStatusChange,
  handleEdit,
  handleDelete,
}) {
  const filtered = tasks
    .filter(
      (task) =>
        (filterStatus === "all" || task.status === filterStatus) &&
        task.status === status &&
        (task.title.toLowerCase().includes(taskQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(taskQuery.toLowerCase()))
    );

  return (
    <Droppable droppableId={`${boardId}-${status}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ marginBottom: "15px", minHeight: "40px" }}
        >
          <h4>{status.toUpperCase()}</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filtered.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                handleStatusChange={handleStatusChange}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
}
