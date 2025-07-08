import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

export default function CommentSection({ taskId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComments = async () => {
        console.log(comments.user)
      try {
        const res = await axios.get(`tasks/${taskId}/comments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };

    if (taskId) {
      fetchComments();
    }
  }, [taskId, token]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `tasks/${taskId}/comments/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        marginTop: "10px",
      }}
    >
      <h4>Comments</h4>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              background: "#f1f1f1",
              padding: "8px",
              borderRadius: "5px",
              marginBottom: "5px",
            }}
          >
            <strong>{comment.author? comment.author : "User"}</strong>: {comment.content}
          </div>
        ))}
      </div>

      <textarea
        placeholder="Write a comment..."
        rows="3"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          borderRadius: "5px",
          padding: "8px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={handlePost} style={{ padding: "6px 10px" }}>
          Post
        </button>
        <button onClick={onClose} style={{ padding: "6px 10px" }}>
          Close
        </button>
      </div>
    </div>
  );
}
