import React from 'react';
import { Users, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

const SimpleCard = ({ title, count, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  // Sample data - replace with actual data from your API
  const dashboardData = {
    doctorCount: 24,
    totalAppointments: 156,
    completedAppointments: 98,
    pendingAppointments: 58
  };

  return (
    <div className="p-4 bg-gray-50 w-full">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SimpleCard 
          title="Doctors" 
          count={dashboardData.doctorCount} 
          icon={<Users size={24} className="text-blue-500" />} 
        />
        
        <SimpleCard 
          title="Total Appointments" 
          count={dashboardData.totalAppointments} 
          icon={<Calendar size={24} className="text-purple-500" />} 
        />
        
        <SimpleCard 
          title="Completed" 
          count={dashboardData.completedAppointments} 
          icon={<CheckSquare size={24} className="text-green-500" />} 
        />
        
        <SimpleCard 
          title="Pending" 
          count={dashboardData.pendingAppointments} 
          icon={<AlertCircle size={24} className="text-orange-500" />} 
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Recent Appointments</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Patient</th>
              <th className="text-left py-2">Doctor</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">John Doe</td>
              <td className="py-2">Dr. Smith</td>
              <td className="py-2">2025-03-10</td>
              <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span></td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Jane Smith</td>
              <td className="py-2">Dr. Johnson</td>
              <td className="py-2">2025-03-10</td>
              <td className="py-2"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span></td>
            </tr>
            <tr>
              <td className="py-2">Mike Brown</td>
              <td className="py-2">Dr. Garcia</td>
              <td className="py-2">2025-03-11</td>
              <td className="py-2"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;