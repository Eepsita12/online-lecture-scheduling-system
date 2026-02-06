import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    courses: 0,
    instructors: 0,
    lectures: 0,
  });

  // Modal states
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showLecturesModal, setShowLecturesModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch all three data sources in parallel
        const [coursesRes, instructorsRes, lecturesRes] = await Promise.all([
          api.get("/courses"),
          api.get("/instructors"),
          api.get("/lectures"),
        ]);

        // Update courses list
        setCourses(coursesRes.data || []);
        setInstructors(instructorsRes.data || []);
        setLectures(lecturesRes.data || []);

        // Update statistics
        setStats({
          courses: coursesRes.data?.length || 0,
          instructors: instructorsRes.data?.length || 0,
          lectures: lecturesRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
          url: err.config?.url,
        });

        // Show user-friendly error
        setError(
          err.response?.data?.message || 
          "Failed to load dashboard data. Please refresh the page."
        );

        // Set default stats to 0
        setStats({ courses: 0, instructors: 0, lectures: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="main-layout">
      <h1>Admin Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && (
        <div className="stats-grid">
          {/* Total Courses Card */}
          <div className="stat-card" style={{ cursor: "pointer" }}>
            <h3>{stats.courses}</h3>
            <p>Total Courses</p>
          </div>

          {/* Total Instructors Card - Clickable */}
          <div 
            className="stat-card" 
            style={{ cursor: "pointer" }}
            onClick={() => setShowInstructorModal(true)}
          >
            <h3>{stats.instructors}</h3>
            <p>Total Instructors</p>
            <small style={{ color: "#666", marginTop: "10px" }}>Click to view</small>
          </div>

          {/* Total Lectures Card - Clickable */}
          <div 
            className="stat-card" 
            style={{ cursor: "pointer" }}
            onClick={() => setShowLecturesModal(true)}
          >
            <h3>{stats.lectures}</h3>
            <p>Total Lectures Scheduled</p>
            <small style={{ color: "#666", marginTop: "10px" }}>Click to view</small>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <h2 style={{ marginTop: "40px" }}>All Courses</h2>
      
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses created yet. Start by adding a new course.</p>
      ) : (
        <div className="grid-container">
          {courses.map((course) => (
            <div key={course._id} className="dashboard-card">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
              )}
              <span className="badge">{course.level}</span>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Instructors Modal */}
      {showInstructorModal && (
        <div className="modal-overlay" onClick={() => setShowInstructorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Instructors ({instructors.length})</h2>
              <button 
                className="modal-close"
                onClick={() => setShowInstructorModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {instructors.length === 0 ? (
                <p>No instructors found.</p>
              ) : (
                <table className="instructors-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map((instructor) => (
                      <tr key={instructor._id}>
                        <td>{instructor.name}</td>
                        <td>{instructor.email}</td>
                        <td style={{ fontSize: "12px", color: "#666" }}>
                          {instructor._id.substring(0, 8)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lectures Modal */}
      {showLecturesModal && (
        <div className="modal-overlay" onClick={() => setShowLecturesModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Scheduled Lectures ({lectures.length})</h2>
              <button 
                className="modal-close"
                onClick={() => setShowLecturesModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {lectures.length === 0 ? (
                <p>No lectures scheduled yet.</p>
              ) : (
                <table className="lectures-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Instructor Name</th>
                      <th>Instructor Email</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures.map((lecture) => (
                      <tr key={lecture._id}>
                        <td>{lecture.course?.name || "N/A"}</td>
                        <td>{lecture.instructor?.name || "N/A"}</td>
                        <td style={{ fontSize: "14px" }}>
                          {lecture.instructor?.email || "N/A"}
                        </td>
                        <td>{formatDate(lecture.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
