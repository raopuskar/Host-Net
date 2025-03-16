import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointment = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get doctor ID from local storage or context
  const doctorId = localStorage.getItem('doctorId') || 'sample-doctor-id';

  // Sample patient data
  const samplePatients = [
    {
      _id: 'patient1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      image: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      _id: 'patient2',
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      _id: 'patient3',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      image: null
    },
    {
      _id: 'patient4',
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      image: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      _id: 'patient5',
      name: 'Lisa Martinez',
      email: 'lisa.m@example.com',
      image: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    {
      _id: 'patient6',
      name: 'David Thompson',
      email: 'david.t@example.com',
      image: null
    }
  ];

  // Sample appointment data
  const sampleAppointments = [
    {
      _id: 'apt1',
      patient: samplePatients[0],
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      reason: 'Annual checkup',
      notes: 'Patient has history of high blood pressure',
      status: 'scheduled'
    },
    {
      _id: 'apt2',
      patient: samplePatients[1],
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      reason: 'Flu symptoms',
      notes: 'Patient reporting fever and cough for 3 days',
      status: 'scheduled'
    },
    {
      _id: 'apt3',
      patient: samplePatients[2],
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      reason: 'Follow-up after surgery',
      notes: 'Post-op evaluation',
      status: 'completed'
    },
    {
      _id: 'apt4',
      patient: samplePatients[3],
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      reason: 'Back pain consultation',
      notes: 'Chronic lower back pain',
      status: 'completed'
    },
    {
      _id: 'apt5',
      patient: samplePatients[4],
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      reason: 'Skin rash',
      notes: 'Possible allergic reaction',
      status: 'scheduled'
    },
    {
      _id: 'apt6',
      patient: samplePatients[5],
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
      reason: 'Vaccination',
      notes: 'Seasonal flu vaccine',
      status: 'cancelled'
    },
    {
      _id: 'apt7',
      patient: samplePatients[0],
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      reason: 'Headache',
      notes: 'Recurring migraine',
      status: 'completed'
    },
    {
      _id: 'apt8',
      patient: samplePatients[2],
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      reason: 'Prescription renewal',
      notes: 'Blood pressure medication',
      status: 'scheduled'
    }
  ];

  // Sample review data
  const sampleReviews = [
    {
      _id: 'rev1',
      patient: samplePatients[0],
      rating: 5,
      feedback: 'Dr. Smith is extremely thorough and took the time to explain everything. I highly recommend!',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      appointmentDetails: {
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Annual checkup'
      }
    },
    {
      _id: 'rev2',
      patient: samplePatients[1],
      rating: 4,
      feedback: 'Good experience overall. Wait time was a bit longer than expected.',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      appointmentDetails: {
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Stomach pain'
      }
    },
    {
      _id: 'rev3',
      patient: samplePatients[3],
      rating: 5,
      feedback: 'The doctor was very attentive and the treatment has been very effective. Thank you!',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      appointmentDetails: {
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Back pain consultation'
      }
    },
    {
      _id: 'rev4',
      patient: samplePatients[5],
      rating: 3,
      feedback: 'Treatment was good but the office staff could be more friendly and organized.',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      appointmentDetails: {
        date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Ear infection'
      }
    }
  ];

  // Fetch doctor's appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Comment out the actual API call and use sample data instead
      // const response = await axios.get(`/doctors/${doctorId}/appointments`);
      // setAppointments(response.data.data);
      
      // Use sample data
      setTimeout(() => {
        setAppointments(sampleAppointments);
        setLoading(false);
      }, 800); // Simulate network delay
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again.');
      console.error('Error fetching appointments:', err);
      setLoading(false);
    }
  };

  // Fetch doctor's reviews
  const fetchReviews = async () => {
    try {
      // Comment out the actual API call and use sample data instead
      // const response = await axios.get(`/api/doctors/${doctorId}/reviews`);
      // setReviews(response.data.data);
      
      // Use sample data
      setReviews(sampleReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Comment out the actual API call
      // await axios.patch(`/api/appointments/${appointmentId}/status`, {
      //   status: newStatus
      // });
      
      // Update local state to reflect the change
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === appointmentId 
            ? { ...appointment, status: newStatus } 
            : appointment
        )
      );
      
      alert(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update appointment status');
      console.error('Error updating appointment status:', err);
    }
  };

  // Handle appointment actions
  const handleAppointmentAction = (appointmentId, action) => {
    const statusMap = {
      complete: 'completed',
      cancel: 'cancelled',
      reschedule: 'rescheduled'
    };
    
    if (statusMap[action]) {
      updateAppointmentStatus(appointmentId, statusMap[action]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAppointments();
    fetchReviews();
  }, [doctorId]);

  // Filter appointments based on tab and status filter
  const filteredAppointments = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    
    // Filter by tab (upcoming/past)
    if (activeTab === 'upcoming' && appointmentDate < today) {
      return false;
    }
    if (activeTab === 'past' && appointmentDate >= today) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && appointment.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const patient = appointment.patient;
      const searchLower = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        appointment.reason.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Calculate stats for dashboard
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(app => new Date(app.date) >= new Date()).length,
    completed: appointments.filter(app => app.status === 'completed').length,
    cancelled: appointments.filter(app => app.status === 'cancelled').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 'N/A'
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Doctor Appointment Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Appointments</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Upcoming</h3>
          <p className="text-2xl font-bold">{stats.upcoming}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Rating</h3>
          <p className="text-2xl font-bold flex items-center">
            {stats.averageRating}
            {stats.averageRating !== 'N/A' && (
              <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Appointments
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Appointments
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Patient Reviews
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      {activeTab !== 'reviews' ? (
        <>
          {/* Appointment Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md px-3 py-2 pl-8 w-full md:w-64"
              />
              <svg
                className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Appointments Table */}
          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} appointments found.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {appointment.patient.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={appointment.patient.image}
                                alt={appointment.patient.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {appointment.patient.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.patient.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appointment.reason}</div>
                        {appointment.notes && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {appointment.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {activeTab === 'upcoming' && appointment.status === 'scheduled' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleAppointmentAction(appointment._id, 'complete')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appointment._id, 'cancel')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        <button className="text-blue-600 hover:text-blue-900 ml-3">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        // Reviews Tab Content
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews available yet.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0">
                      {review.patient.image ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={review.patient.image}
                          alt={review.patient.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {review.patient.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{review.patient.name}</h3>
                        <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {review.rating} out of 5 stars
                        </span>
                      </div>
                      
                      <p className="mt-3 text-gray-700">{review.feedback}</p>
                      
                      {review.appointmentDetails && (
                        <div className="mt-2 text-sm text-gray-500">
                          Appointment: {formatDate(review.appointmentDetails.date)} - {review.appointmentDetails.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointment;