import { useEffect, useState } from "react";
import api from "../../services/api";

const AssignLecture = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    instructorId: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch courses and instructors on mount
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          api.get("/courses"),
          api.get("/instructors"),
        ]);

        setCourses(coursesRes.data || []);
        setInstructors(instructorsRes.data || []);
      } catch (err) {
        console.error("Fetch courses/instructors error:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load courses and instructors."
        );
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!form.courseId || !form.instructorId || !form.date) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Find selected course and instructor names for better UX
    const selectedCourse = courses.find((c) => c._id === form.courseId);
    const selectedInstructor = instructors.find(
      (i) => i._id === form.instructorId
    );

    try {
      // Send to backend: course, instructor, date
      await api.post("/lectures", {
        course: form.courseId,
        instructor: form.instructorId,
        date: form.date,
      });

      setSuccess(
        `✅ Lecture assigned successfully! ` +
        `${selectedCourse?.name} → ${selectedInstructor?.name} on ${new Date(form.date).toDateString()}`
      );

      // Reset form
      setForm({ courseId: "", instructorId: "", date: "" });

      // Clear message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      // Backend returns 400 with specific error message
      // Error code 11000 is for duplicate instructor+date combination
      if (err.response?.status === 400) {
        setError(
          err.response.data.message || 
          "This instructor already has a lecture on this date!"
        );
      } else {
        setError(
          err.response?.data?.message || 
          "Failed to assign lecture. Please try again."
        );
      }
      console.error("Assign lecture error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <div className="card">
        <h2>Assign Lecture</h2>

        <div
          className="warning-box"
          style={{
            borderLeft: "4px solid #f59e0b",
            backgroundColor: "#fffbeb",
            color: "#92400e",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <p>
            <strong>⚠️ Important:</strong> An instructor cannot be assigned to more than one lecture on the same date.
          </p>
          <p style={{ marginTop: "8px" }}>
            The system will automatically prevent double-booking.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {fetchLoading ? (
          <p>Loading courses and instructors...</p>
        ) : courses.length === 0 || instructors.length === 0 ? (
          <div style={{ color: "#dc2626", padding: "12px", backgroundColor: "#fee2e2", borderRadius: "4px" }}>
            {courses.length === 0 && <p>❌ No courses available. Create a course first.</p>}
            {instructors.length === 0 && <p>❌ No instructors available. Create an instructor first.</p>}
          </div>
        ) : (
          <form onSubmit={handleAssign} className="form-stack">
            <div className="form-group">
              <label htmlFor="courseId">Select Course *</label>
              <select
                id="courseId"
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">-- Choose a course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="instructorId">Select Instructor *</label>
              <select
                id="instructorId"
                name="instructorId"
                value={form.instructorId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">-- Choose an instructor --</option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name} ({instructor.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Select Date *</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                disabled={loading}
              />
              <small style={{ color: "#666", marginTop: "4px", display: "block" }}>
                Can only assign future dates
              </small>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || courses.length === 0 || instructors.length === 0}
            >
              {loading ? "Assigning..." : "Confirm Assignment"}
            </button>
          </form>
        )}

        <p className="note" style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Once assigned, the instructor will see this lecture in their dashboard.
        </p>
      </div>
    </div>
  );
};

export default AssignLecture;

