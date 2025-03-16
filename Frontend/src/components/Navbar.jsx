import React, { useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo1 from "../assets/Logo/logo2.png";
import MyProfile_Pic from "../assets/profile_pic/p1.webp";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {backEndUrl,userData} = useContext(AppContext);
  const navigate = useNavigate();

  // Check token on component mount and when it changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/patient/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Clear all auth related data
        localStorage.clear();
        
        // Let the server handle cookie clearing - don't manipulate cookies directly
        // The server's res.clearCookie() should handle this
        
        setIsLoggedIn(false);
        toast.success(data.message || "Logged out successfully");
        window.location.reload(true); // Force a fresh page load after logout

        navigate("/");
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar flex items-center justify-between px-6 py-2 shadow-md bg-white">
      <Link to="/">
        <img src={Logo1} alt="logo" className="w-[6rem] object-contain" />
      </Link>

      <ul className="flex items-center gap-20">
        <li>
          <Link
            to="/"
            className="text-gray-700 text-lg hover:text-blue-500 transition duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/Services"
            className="text-gray-700 text-lg hover:text-blue-500 transition duration-300"
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/doctors"
            className="text-gray-700 text-lg hover:text-blue-500 transition duration-300"
          >
            Find Doctor
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="text-gray-700 text-lg hover:text-blue-500 transition duration-300"
          >
            Contact Us
          </Link>
        </li>
      </ul>

      {isLoggedIn ? (
        <div className="flex items-center gap-2 cursor-pointer group relative">
          <img
            className="w-10 h-10 rounded-full object-scale-down"
            src={`${backEndUrl}/${userData.image}`}
            alt=""
          />
          <i className="fa-solid fa-caret-down"></i>
          <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block z-20">
            <div className="text-white flex flex-col items-center px-2 py-2 h-auto w-40 bg-sky-950 rounded-md">
              <p
                onClick={() => navigate("/my-profile")}
                className="cursor-pointer hover:text-blue-300 w-full text-center py-1"
              >
                Profile
              </p>
              <p
                onClick={() => navigate("/my-appointment")}
                className="cursor-pointer hover:text-blue-300 w-full text-center py-1"
              >
                Appointment
              </p>
              <p
                onClick={handleLogout}
                className="cursor-pointer hover:text-blue-300 w-full text-center py-1"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Link to="/login">
          <button className="px-5 py-2 mx-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
