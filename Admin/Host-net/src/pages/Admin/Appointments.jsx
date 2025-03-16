import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, X } from 'lucide-react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching appointments data
    const fetchAppointments = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/appointments');
        // const data = await response.json();
        
        // Mock data
        const mockAppointments = [
          { 
            id: 1, 
            patientName: 'John Smith', 
            patientEmail: 'john.smith@example.com',
            patientPhone: '(555) 123-4567',
            doctorName: 'Dr. Jane Wilson', 
            doctorSpecialization: 'Cardiologist',
            date: '2025-03-10', 
            time: '09:30 AM', 
            status: 'completed',
            notes: 'Follow-up in 3 months'
          },
          { 
            id: 2, 
            patientName: 'Sarah Johnson', 
            patientEmail: 'sarah.j@example.com',
            patientPhone: '(555) 234-5678',
            doctorName: 'Dr. Michael Lee', 
            doctorSpecialization: 'Orthopedic Surgeon',
            date: '2025-03-10', 
            time: '11:00 AM', 
            status: 'in-progress',
            notes: 'X-ray results review'
          },
          { 
            id: 3, 
            patientName: 'Emily Davis', 
            patientEmail: 'emily.davis@example.com',
            patientPhone: '(555) 345-6789',
            doctorName: 'Dr. Sarah Johnson', 
            doctorSpecialization: 'Pediatrician',
            date: '2025-03-10', 
            time: '02:15 PM', 
            status: 'cancelled',
            notes: 'Patient canceled due to illness'
          },
          { 
            id: 4, 
            patientName: 'Robert Brown', 
            patientEmail: 'rbrown@example.com',
            patientPhone: '(555) 456-7890',
            doctorName: 'Dr. John Davis', 
            doctorSpecialization: 'Neurologist',
            date: '2025-03-11', 
            time: '10:00 AM', 
            status: 'scheduled',
            notes: 'First consultation'
          },
          { 
            id: 5, 
            patientName: 'Lisa Wilson', 
            patientEmail: 'lisa.w@example.com',
            patientPhone: '(555) 567-8901',
            doctorName: 'Dr. Emily Wilson', 
            doctorSpecialization: 'Dermatologist',
            date: '2025-03-11', 
            time: '03:30 PM', 
            status: 'scheduled',
            notes: 'Annual skin check'
          },
        ];
        
        setAppointments(mockAppointments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'in-progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen w-full">
      <h1 className="text-xl font-bold mb-6">Appointments</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient, doctor, or date"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setSearchTerm('')}
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Time
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                      <div className="text-sm text-gray-500">{appointment.patientPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {appointment.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No appointments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;