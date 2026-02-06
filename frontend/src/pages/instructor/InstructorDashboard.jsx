import { useEffect, useState } from "react";
import api from "../../services/api";

const InstructorDashboard = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyLectures = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/lectures/my");

        // Backend returns array of lecture objects with populated course
        // Each lecture has: { _id, course: { _id, name }, instructor, date, ... }
        setLectures(res.data || []);
      } catch (err) {
        console.error("Fetch my lectures error:", {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
          url: err.config?.url,
        });

        // Check if it's an auth error
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          // The response interceptor in api.js will handle the redirect
        } else {
          setError(
            err.response?.data?.message || 
            "Failed to load lectures. Please refresh the page."
          );
        }

        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLectures();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="main-layout">
      <h1>My Lectures</h1>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <p>Loading your lectures...</p>
      ) : lectures.length === 0 ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f0f9ff",
            borderLeft: "4px solid #3b82f6",
            borderRadius: "4px",
          }}
        >
          <p>
            No lectures assigned yet. Check back later or contact the admin.
          </p>
        </div>
      ) : (
        <div className="lectures-container">
          {lectures.map((lecture) => (
            <div key={lecture._id} className="dashboard-card lecture-card">
              <h3>{lecture.course?.name || "Unknown Course"}</h3>
              
              <div style={{ marginTop: "12px", color: "#666" }}>
                <p>
                  <strong>📅 Date:</strong> {formatDate(lecture.date)}
                </p>
                {lecture.course?._id && (
                  <p>
                    <strong>🆔 Course ID:</strong> {lecture.course._id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
