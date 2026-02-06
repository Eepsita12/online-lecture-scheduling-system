import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";

// Public Pages
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import InstructorLogin from "./pages/instructor/InstructorLogin";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateInstructor from "./pages/admin/CreateInstructor";
import CreateCourse from "./pages/admin/CreateCourse";
import AssignLecture from "./pages/admin/AssignLecture";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

/* 
  Layout that wraps all authenticated pages.
  Navbar is shown only after login.
*/
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/instructor/login" element={<InstructorLogin />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="create-instructor" element={<CreateInstructor />} />
          <Route path="assign-lecture" element={<AssignLecture />} />
        </Route>

        {/* ================= INSTRUCTOR ROUTES ================= */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute role="instructor">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstructorDashboard />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
