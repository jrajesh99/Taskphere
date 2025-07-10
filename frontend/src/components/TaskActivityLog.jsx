import React, { useEffect, useState, useRef } from "react";

const PAGE_SIZE = 5;

export default function TaskActivityLog({ taskId, searchTerm, onClose }) {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  
  const initialFetchDone = useRef(false);

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

  useEffect(() => {
    // Reset logs when taskId changes
    setLogs([]);
    setPage(1);
    setHasMore(true);
  }, [taskId]);  

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tasks/${taskId}/logs/?page=${page}&page_size=${PAGE_SIZE}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        console.log("______________________", data)
        setLogs((prev) => [...prev, ...data.results]);
        setHasMore(data.results.length === PAGE_SIZE);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    if (taskId && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchLogs();
    } else if (page > 1) {
      fetchLogs();
    }
  }, [taskId, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#f1f1f1",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          marginBottom: "8px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Activity Log</span>
        <button onClick={onClose} style={{ fontSize: "12px", color: "red" }}>
          ❌ Close
        </button>
      </div>

      {logs.map((log, index) => (
        <div 
          key={`${log.id}-${index}`}
          style={{
            padding: "6px 0",
            borderBottom: "1px solid #ccc",
            fontSize: "0.9rem",
          }}
        >
          <div>
            🧑{" "}
            <strong>
              {log.user.name || log.user.email || "Unknown User"}
            </strong>
          </div>
          <div>{highlightMatch(log.message, searchTerm)}</div>
          <div style={{ fontSize: "0.8rem", color: "#777" }}>
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      ))}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          style={{
            marginTop: "10px",
            fontSize: "0.85rem",
            backgroundColor: "#dfe6e9",
            padding: "5px 10px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}
