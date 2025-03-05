import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo1 from '../assets/Logo/logo2.png';
import MyProfile_Pic from '../assets/profile_pic/template_3.jpg';
import { useNavigate } from 'react-router-dom';
import MyAppointment from '../pages/MyAppointment';
import MyProfile from '../pages/MyProfile';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  const navigate = useNavigate();

  return (
    <nav className="navbar flex items-center justify-between px-6 py-2 shadow-md bg-white">
      <Link to="/">
        <img
          src={Logo1}
          alt="logo"
          className="w-[6rem] object-contain"
        />
      </Link>

      <ul className="flex items-center gap-20">
        <li>
          <Link to="/" className="text-gray-700 text-lg hover:text-blue-500 transition duration-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/Services" className="text-gray-700 text-lg hover:text-blue-500 transition duration-300">
            Services
          </Link>
        </li>
        <li>
          <Link to="/doctors" className="text-gray-700 text-lg hover:text-blue-500 transition duration-300">
            Find Doctor
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-gray-700 text-lg hover:text-blue-500 transition duration-300">
            Contact Us
          </Link>
        </li>
      </ul>

      {token ? (
        <div className='flex items-center gap-2 cursor-pointer group relative'>
          <img className="w-10 h-10 rounded-full object-cover" src={MyProfile_Pic} alt='' />
          <i className="fa-solid fa-caret-down"></i>
          <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block z-20'>
            <div className='text-white flex flex-col items-center px-2 py-2 h-auto w-40 bg-sky-950 rounded-md'>
              <p onClick={() => navigate('/my-profile')} className="cursor-pointer hover:text-blue-300 w-full text-center py-1">Profile</p>
              <p onClick={() => navigate('/my-appointment')} className="cursor-pointer hover:text-blue-300 w-full text-center py-1">Appointment</p>
              <p onClick={() => setToken(false)} className="cursor-pointer hover:text-blue-300 w-full text-center py-1">Logout</p>
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
