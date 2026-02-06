import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const InstructorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // Backend returns { token, role }
      const { token, role } = res.data;
      
      if (!token || !role) {
        throw new Error("Invalid response from server");
      }

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "instructor") {
        navigate("/instructor");
      } else {
        // Fallback if instructor somehow has admin role
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2>Instructor Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="instructor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="note" style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Don't have an account? Ask the admin to create one for you.
        </p>
      </div>
    </div>
  );
};

export default InstructorLogin;

