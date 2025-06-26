import { useState } from 'react';
import axios from '../api/axiosConfig';

export default function TaskForm({ boardId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('tasks/', {
        title,
        description,
        board: boardId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Task created!');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder='Task Title' value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
      <button type='submit'>Create Task</button>
    </form>
  );
}
