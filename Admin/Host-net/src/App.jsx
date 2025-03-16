import React, { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; //add this if toast is not working
import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/Login";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddDoctor from "./pages/Admin/AddDoctor";
import Doctors from "./pages/Admin/Doctors";
import Appointments from "./pages/Admin/Appointments";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";

import Profile from "./pages/Doctor/Profile";
import Appointment from "./pages/Doctor/Appointments";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // For admin users
  if (aToken) {
    return (
      <div className="bg-[#f0f2f5]">
        <ToastContainer />
        <Navbar userType="admin" />
        <div className="flex items-start">
          <Sidebar userType="admin" />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<Doctors />} />
              <Route path="/admin/appointments" element={<Appointments />} />
              <Route path="/admin/add-doctor" element={<AddDoctor />} />
              {/* Catch invalid admin routes */}
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
              {/* Prevent access to doctor routes */}
              <Route path="/doctor/*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  // For doctor users
  if (dToken) {
    return (
      <div className="bg-[#f0f2f5]">
        <ToastContainer />
        <Navbar userType="doctor" />
        <div className="flex items-start">
          <Sidebar userType="doctor" />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/doctor/dashboard" />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<Appointment />} />
              <Route path="/doctor/profile" element={<Profile />} />
              <Route path="/doctor/*" element={<Navigate to="/doctor/dashboard" />} />
              {/* Prevent access to admin routes */}
              <Route path="/admin/*" element={<Navigate to="/doctor/dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  // If no token exists, show login page
  return (
    <>
      <LoginPage />
      <ToastContainer />
    </>
  );
};

export default App;