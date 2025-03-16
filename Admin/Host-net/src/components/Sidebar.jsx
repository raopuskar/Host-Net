import React, { useState,useContext } from 'react';
import { Home, Users, Calendar, UserPlus, ChevronLeft, ChevronRight, Stethoscope, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const adminMenuItems = [
    {
      path: 'admin/dashboard',
      name: 'Dashboard',
      icon: <Home size={20} />
    },
    {
      path: 'admin/doctors',
      name: 'Doctors',
      icon: <Users size={20} />
    },
    {
      path: 'admin/appointments',
      name: 'Appointments',
      icon: <Calendar size={20} />
    },
    {
      path: 'admin/add-doctor',
      name: 'Add Doctor',
      icon: <UserPlus size={20} />
    }
  ];

  const doctorMenuItems = [
    {
      path: 'doctor/dashboard',
      name: 'Dashboard',
      icon: <Home size={20} />
    },
    {
      path: 'doctor/appointments',
      name: 'My Appointments',
      icon: <Calendar size={20} />
    },
    {
      path: 'doctor/profile',
      name: 'My Profile',
      icon: <Stethoscope size={20} />
    }
  ];

  const menuItems = aToken ? adminMenuItems : doctorMenuItems;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`bg-white shadow-md h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold text-gray-700">{aToken ? 'Admin Panel' : 'Doctor Panel'}</h2>}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  currentPath === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;