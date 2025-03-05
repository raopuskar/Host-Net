import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";  //add this if toast is not working
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard"; // Import your dashboard
import DoctorDashboard from "./pages/DoctorDashboard"; // Import doctor dashboard

const ProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  return aToken ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  return aToken ? <Navigate to="/admin" replace /> : children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes (Only logged-in users can access) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
