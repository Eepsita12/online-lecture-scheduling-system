import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">📚 Schedulr</h1>

        <div className="nav-links">
          {role === "admin" ? (
            // Admin Navigation
            <>
              <Link
                to="/admin"
                className={location.pathname === "/admin" ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/create-course"
                className={
                  location.pathname === "/admin/create-course" ? "active" : ""
                }
              >
                Add Course
              </Link>
              <Link
                to="/admin/create-instructor"
                className={
                  location.pathname === "/admin/create-instructor" ? "active" : ""
                }
              >
                Add Instructor
              </Link>
              <Link
                to="/admin/assign-lecture"
                className={
                  location.pathname === "/admin/assign-lecture" ? "active" : ""
                }
              >
                Assign Lecture
              </Link>
            </>
          ) : role === "instructor" ? (
            // Instructor Navigation
            <>
              <Link
                to="/instructor"
                className={location.pathname === "/instructor" ? "active" : ""}
              >
                My Lectures
              </Link>
            </>
          ) : null}
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
