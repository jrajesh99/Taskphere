import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

export default function TaskColumn({
  boardId,
  status,
  tasks,
  filterStatus,
  dueDateFilter,
  filterPriority,
  taskQuery,
  handleStatusChange,
  handleEdit,
  handleDelete,
}) {
  const isDueMatch = (dueDateStr) => {
    if (dueDateFilter === "all") return true;
    if (!dueDateStr) return false;

    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diff = (dueDate - today) / (1000 * 60 * 60 * 24);

    if (dueDateFilter === "overdue")
      return dueDate < today.setHours(0, 0, 0, 0);
    if (dueDateFilter === "today")
      return dueDate.toDateString() === today.toDateString();
    if (dueDateFilter === "upcoming") return diff > 0;

    return true;
  };
  const filtered = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      task.status === status &&
      (filterPriority === "all" || task.priority === filterPriority) &&
      isDueMatch(task.due_date) &&
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
