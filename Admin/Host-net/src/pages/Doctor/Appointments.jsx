import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorIds, setDoctorIds] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [reasonInputs, setReasonInputs] = useState({});

  const { backEndUrl, allReviews } = useContext(AppContext);
  const { dToken } = useContext(DoctorContext);

  // Fetch appointments when component mounts
  useEffect(() => {
    if (!dToken) {
      setLoading(false);
      setError("Authentication token missing. Please log in.");
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backEndUrl}/doctor/get-my-appointment`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${dToken}` },
          }
        );

        if (data) {
          setAppointments(data);
          setLoading(false);
        } else {
          toast.error("No data received");
          setLoading(false);
          setError("No appointment data received");
        }
      } catch (error) {
        setLoading(false);
        setError(
          error.response?.data?.message || "Error fetching appointment data"
        );
        toast.error(
          error.response?.data?.message || "Error fetching appointment data"
        );
      }
    };

    fetchAppointments();
  }, [backEndUrl, dToken]);

  // Extract patient details
  useEffect(() => {
    if (!appointments.length) return;

    const patientMap = {};
    appointments.forEach((appointment) => {
      if (appointment.patientId && appointment.patientId.length > 0) {
        const patient = appointment.patientId[0];
        if (patient) {
          patientMap[appointment._id] = patient;
        }
      }
    });

    setPatientNames(patientMap);
  }, [appointments]);

  // Extract doctor IDs for reviews
  useEffect(() => {
    if (appointments.length > 0) {
      const extractedIds = appointments
        .filter((app) => app.doctorId && app.doctorId.length > 0)
        .map((app) => app.doctorId[0]._id);

      if (extractedIds.length > 0) {
        setDoctorIds([...new Set(extractedIds)]); // Remove duplicates
      }
    }
  }, [appointments]);

  // Fetch doctor's reviews
  useEffect(() => {
    if (!doctorIds.length) return;

    const fetchRating = async () => {
      try {
        const { data } = await axios.get(
          `${backEndUrl}/doctor/get-rating/${doctorIds}`
        );
        if (data) {
          setRating(data);
        }
      } catch (err) {
        toast.error("Failed to load rating");
      }
    };

    fetchRating();
  }, [doctorIds, backEndUrl]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Filter reviews for this doctor
        const filteredReviews = allReviews.filter(
          (rev) => doctorIds.some(id => String(rev.doctorId) === String(id))
        );

        if (filteredReviews.length > 0) {
          setReviews(filteredReviews);
        }
      } catch (error) {
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [doctorIds, allReviews]);

  // Handle input changes for reason and notes
  const handleReasonInputChange = (appointmentId, field, value) => {
    setReasonInputs(prev => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [field]: value
      }
    }));
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus, reason = "", notes = "") => {
    try {
      // Prepare the data to send
      const updateData = { 
        status: newStatus
      };
      
      // Only include reason and notes if they are provided
      if (reason) updateData.reason = reason;
      if (notes) updateData.notes = notes;

      await axios.patch(
        `${backEndUrl}/doctor/update-appointment-status/${appointmentId}`,
        updateData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      // Update local state to reflect the change
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { 
                ...appointment, 
                status: newStatus,
                reason: reason || appointment.reason,
                notes: notes || appointment.notes
              }
            : appointment
        )
      );

      // Clear inputs after successful update
      if (reasonInputs[appointmentId]) {
        setReasonInputs(prev => {
          const newInputs = { ...prev };
          delete newInputs[appointmentId];
          return newInputs;
        });
      }

      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update appointment status");
    }
  };

  // Handle appointment actions
  const handleAppointmentAction = (appointmentId, action) => {
    const statusMap = {
      complete: "Completed",
      cancel: "cancelled",
      reschedule: "rescheduled",
    };

    const inputs = reasonInputs[appointmentId] || {};
    const reason = inputs.reason || "";
    const notes = inputs.notes || "";

    if (statusMap[action]) {
      updateAppointmentStatus(appointmentId, statusMap[action], reason, notes);
    } else if (!action) {
      // This handles the submit button for reason/notes without status change
      updateAppointmentStatus(
        appointmentId, 
        appointments.find(a => a._id === appointmentId)?.status || "pending",
        reason, 
        notes
      );
    }
  };

  // Normalize status for consistent filtering
  const normalizeStatus = (status) => {
    if (!status) return "";
    status = status.toLowerCase();
    return status === "completed" ? "completed" : status;
  };

  // Filter appointments based on tab and status filter
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(
      appointment.appointmentDate || appointment.date
    );

    // Filter by tab (upcoming/past)
    if (activeTab === "upcoming" && appointmentDate < today) {
      return false;
    }
    if (activeTab === "past" && appointmentDate >= today) {
      return false;
    }

    // Filter by status
    if (statusFilter !== "all" && normalizeStatus(appointment.status) !== normalizeStatus(statusFilter)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const patient = patientNames[appointment._id] || {};
      const searchLower = searchQuery.toLowerCase();

      return (
        (patient.name && patient.name.toLowerCase().includes(searchLower)) ||
        (patient.email && patient.email.toLowerCase().includes(searchLower)) ||
        (appointment.reason &&
          appointment.reason.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Calculate stats for dashboard
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter((app) => normalizeStatus(app.status) === "pending").length,
    completed: appointments.filter((app) => normalizeStatus(app.status) === "completed").length,
    cancelled: appointments.filter((app) => normalizeStatus(app.status) === "cancelled").length,
    averageRating: rating.averageRating || "N/A",
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-gray-100 text-gray-800",
      rescheduled: "bg-yellow-100 text-yellow-800",
    };

    const normalizedStatus = normalizeStatus(status);
    
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[normalizedStatus] || "bg-gray-100"
        }`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
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
            {stats.averageRating !== "N/A" && (
              <svg
                className="w-5 h-5 text-yellow-400 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
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
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming Appointments
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past Appointments
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Patient Reviews
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab !== "reviews" ? (
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
                <option value="pending">Pending</option>
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
              <svg
                className="animate-spin h-8 w-8 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
                  {filteredAppointments.map((appointment) => {
                    const patient = patientNames[appointment._id] || {};
                    const inputs = reasonInputs[appointment._id] || {};

                    return (
                      <tr key={appointment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {patient.image ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={`${backEndUrl}/${patient.image}`}
                                  alt={patient.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {patient.name
                                    ? patient.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.name || "Unknown Patient"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {patient.email || "No email available"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(
                            appointment.appointmentDate || appointment.date
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {appointment.reason ? (
                            // If reason exists, show it
                            <>
                              <div className="text-sm text-gray-900">
                                {appointment.reason}
                              </div>
                              {appointment.notes && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {appointment.notes}
                                </div>
                              )}
                            </>
                          ) : (
                            // If reason is missing, show input fields
                            <div>
                              <input
                                type="text"
                                placeholder="Enter reason"
                                className="border p-1 rounded w-full mb-2"
                                value={inputs.reason || ""}
                                onChange={(e) => 
                                  handleReasonInputChange(appointment._id, "reason", e.target.value)
                                }
                              />
                              <input
                                type="text"
                                placeholder="Enter notes (optional)"
                                className="border p-1 rounded w-full mb-2"
                                value={inputs.notes || ""}
                                onChange={(e) => 
                                  handleReasonInputChange(appointment._id, "notes", e.target.value)
                                }
                              />
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={() => handleAppointmentAction(appointment._id)}
                              >
                                Submit
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={appointment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {activeTab === "upcoming" &&
                            (normalizeStatus(appointment.status) === "scheduled" ||
                              normalizeStatus(appointment.status) === "pending") && (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    handleAppointmentAction(
                                      appointment._id,
                                      "complete"
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() =>
                                    handleAppointmentAction(
                                      appointment._id,
                                      "cancel"
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        // Reviews Tab Content
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Reviews</h2>

          {!reviews || reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews available yet.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0">
                      {review.patient && review.patient.image ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`${backEndUrl}/${review.patient.image}`}
                          alt={review.patient.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {review.patient && review.patient.name
                            ? review.patient.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.patient
                            ? review.patient.name
                            : "Anonymous Patient"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Date not available"}
                        </p>
                      </div>

                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
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

                      <p className="mt-3 text-gray-700">
                        {review.review || "No feedback provided"}
                      </p>

                      {review.appointmentDetails && (
                        <div className="mt-2 text-sm text-gray-500">
                          Appointment:{" "}
                          {formatDate(review.appointmentDetails.date)} -{" "}
                          {review.appointmentDetails.reason}
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