import React, { useState, useContext } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";


  const Navbar = ({ userType }) => {
  const { setAToken } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if(userType==="admin"){
      //First clear the localStorage
      localStorage.removeItem("aToken");
      //update the context
      setAToken(null);
      toast.success("Logging out successfully!");
    }else{
      localStorage.removeItem("dToken");
      setDToken(null);
      toast.success("Logging out successfully!");      
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">HostNet</h1>
            <span className="ml-2 text-gray-500">
              ({userType === "admin" ? "Admin Panel" : "Doctor Panel"})
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center transition duration-150 ease-in-out"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
