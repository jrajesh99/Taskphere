import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import TaskForm from './TaskForm';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await axios.get('boards/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBoards(res.data);

        // Fetch tasks for each board
        const taskMap = {};
        for (let board of res.data) {
          const taskRes = await axios.get('tasks/?board=' + board.id, {
            headers: { Authorization: `Bearer ${token}` }
          });
          taskMap[board.id] = taskRes.data;
        }
        setTasks(taskMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBoards();
  }, [token]);

  return (
    <div>
      <h2>Boards</h2>
      {boards.map(board => (
        <div key={board.id} style={{ border: '1px solid #ccc', margin: '20px', padding: '10px' }}>
          <h3>{board.title}</h3>
          <p>{board.description}</p>

          <h4>Tasks:</h4>
          <ul>
            {tasks[board.id]?.map(task => (
              <li key={task.id}>
                <strong>{task.title}</strong>: {task.description}
              </li>
            )) || <p>Loading tasks...</p>}
          </ul>

          <TaskForm boardId={board.id} />
        </div>
      ))}
    </div>
  );
}
