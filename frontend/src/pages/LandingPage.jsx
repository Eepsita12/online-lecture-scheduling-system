import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Logo & Title */}
        <div className="landing-header">
          <h1 className="landing-logo">📚 Schedulr</h1>
          <p className="landing-subtitle">
            Online Lecture Scheduling System
          </p>
        </div>

        {/* Description */}
        <p className="landing-description">
          Welcome! Please select your role to continue.
        </p>

        {/* Two Login Options */}
        <div className="landing-options">
          {/* Admin Login Card */}
          <div
            className="login-card admin-card"
            onClick={() => navigate("/admin/login")}
          >
            <div className="card-icon">👨‍💼</div>
            <h2>Admin Login</h2>
            <p>Manage courses, instructors, and lectures</p>
            <button className="card-button admin-button">
              Login as Admin →
            </button>
          </div>

          {/* Instructor Login Card */}
          <div
            className="login-card instructor-card"
            onClick={() => navigate("/instructor/login")}
          >
            <div className="card-icon">👨‍🏫</div>
            <h2>Instructor Login</h2>
            <p>View your assigned lectures and schedule</p>
            <button className="card-button instructor-button">
              Login as Instructor →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="landing-footer">
          © 2026 Schedulr. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
