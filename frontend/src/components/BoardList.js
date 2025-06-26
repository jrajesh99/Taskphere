import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import TaskForm from './TaskForm';

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBoardsAndTasks = async () => {
            try {
                const boardRes = await axios.get('boards/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBoards(boardRes.data);

                const taskMap = {};
                for (let board of boardRes.data) {
                    const taskRes = await axios.get(`tasks/?board=${board.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    taskMap[board.id] = taskRes.data;
                }

                setTasks(taskMap);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching boards or tasks:', err);
            }
        };

        fetchBoardsAndTasks();
    }, [token]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(
                'tasks/',
                {
                    id: taskId,
                    status: newStatus
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Refresh tasks
            const updatedTasks = { ...tasks };
            for (let boardId in updatedTasks) {
                const taskRes = await axios.get(`tasks/?board=${boardId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedTasks[boardId] = taskRes.data;
            }
            setTasks(updatedTasks);
        } catch (err) {
            console.error('Failed to update task status:', err);
        }
    };

    const renderTasksByStatus = (status, boardId) => (
        <div key={`${boardId}-${status}`}>
            <h5>{status.toUpperCase()}</h5>
            <ul>
                {(tasks[boardId] || [])
                    .filter(task => task.status === status)
                    .map(task => (
                        <li key={`${task.id}-${status}`}>
                            <strong>{task.title}</strong>: {task.description}
                            <select
                                value={task.status}
                                onChange={e => handleStatusChange(task.id, e.target.value)}
                                style={{ marginLeft: '10px' }}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </li>
                    ))}
            </ul>
        </div>
    );

    if (loading) return <p>Loading boards and tasks...</p>;

    return (
        <div>
            <h2>Boards</h2>
            {boards.map(board => (
                <div
                    key={board.id}
                    style={{
                        border: '1px solid #ccc',
                        margin: '20px 0',
                        padding: '15px',
                        borderRadius: '8px'
                    }}
                >
                    <h3>{board.title}</h3>
                    <p>{board.description}</p>

                    <h4>Tasks</h4>
                    {['todo', 'in-progress', 'done'].map(status =>
                        renderTasksByStatus(status, board.id)
                    )}

                    <TaskForm boardId={board.id} />
                </div>
            ))}
        </div>
    );
}
