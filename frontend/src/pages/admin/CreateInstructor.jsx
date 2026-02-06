import { useState } from "react";
import api from "../../services/api";

const CreateInstructor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdInstructor, setCreatedInstructor] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setCreatedInstructor(null);

    // Validation
    if (!form.name.trim()) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/instructors", form);

      // Backend returns the created instructor with auto-generated password
      const instructor = res.data;
      setCreatedInstructor(instructor);

      setSuccess(
        `✅ Instructor "${form.name}" created successfully! ` +
        `They can log in with email: ${form.email}`
      );

      // Reset form
      setForm({ name: "", email: "" });

      // Clear messages after 10 seconds
      setTimeout(() => {
        setSuccess("");
        setCreatedInstructor(null);
      }, 10000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("This email is already registered.");
      } else {
        setError(
          err.response?.data?.message || 
          "Failed to create instructor. Please try again."
        );
      }
      console.error("Create instructor error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <div className="card">
        <h2>Register New Instructor</h2>

        <div
          className="info-box"
          style={{
            borderLeft: "4px solid #3b82f6",
            backgroundColor: "#eff6ff",
            color: "#1e40af",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <p>
            Registered instructors will be able to log in to their own panel to view assigned lectures.
          </p>
          <p style={{ marginTop: "8px", fontWeight: "500" }}>
            Default password will be automatically generated.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g., Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="instructor@example.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Instructor Account"}
          </button>
        </form>

        {/* Show credentials after successful creation */}
        {createdInstructor && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#f0fdf4",
              borderLeft: "4px solid #22c55e",
              borderRadius: "4px",
              color: "#166534",
              fontSize: "14px",
            }}
          >
            <p>
              <strong>✅ Instructor created! Share these credentials:</strong>
            </p>
            <p style={{ marginTop: "8px" }}>
              <strong>Email:</strong> {createdInstructor.email}
            </p>
            <p>
              <strong>Password:</strong> {createdInstructor.password}
            </p>
            <p style={{ marginTop: "8px", fontStyle: "italic", color: "#4b5563" }}>
              They should log in and change their password after first login.
            </p>
          </div>
        )}

        <p className="note" style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Once created, you can assign lectures to this instructor in the "Assign Lecture" section.
        </p>
      </div>
    </div>
  );
};

export default CreateInstructor;

