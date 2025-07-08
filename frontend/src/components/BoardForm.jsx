import { useState } from "react";
import axios from "../api/axiosConfig";

export default function BoardForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "boards/",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Board created!");
    } catch (err) {
      console.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Board Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating Board..." : "Create Board"}
      </button>
    </form>
  );
}
