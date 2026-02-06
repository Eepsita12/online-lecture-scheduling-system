import { useState } from "react";
import api from "../../services/api";

const CreateCourse = () => {
  const [form, setForm] = useState({
    name: "",
    level: "Beginner",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!form.name.trim()) {
      setError("Course name is required.");
      setLoading(false);
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/courses", form);
      
      setSuccess("✅ Course created successfully! You can now assign lectures to this course.");
      
      // Reset form
      setForm({
        name: "",
        level: "Beginner",
        description: "",
        image: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to create course. Please try again."
      );
      console.error("Create course error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <div className="card">
        <h2>Create New Course</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g., React Basics"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <select
              id="level"
              name="level"
              value={form.level}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe what students will learn..."
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Course Image URL (Optional)</label>
            <input
              id="image"
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={handleChange}
              disabled={loading}
            />
            {form.image && (
              <img
                src={form.image}
                alt="Course preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginTop: "10px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>

        <p className="note" style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          After creating a course, you'll be able to assign multiple lectures (batches) to it.
        </p>
      </div>
    </div>
  );
};

export default CreateCourse;

