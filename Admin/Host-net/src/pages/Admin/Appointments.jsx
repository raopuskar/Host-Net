import { useEffect, useState, useContext } from "react";
import { Search, Filter, Calendar, Clock, X } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [allRatings, setAllRatings] = useState([]);

  const { allDoctors, allAppointments, allPatients, backEndUrl } = useContext(AppContext);

  // First useEffect - enriches appointments with doctor and patient info
  useEffect(() => {
    if (allAppointments && allDoctors && allPatients) {
      const enrichedAppointments = allAppointments.map((appointment) => {
        const doctor =
          allDoctors.find((doc) => doc._id === appointment.doctorId[0]) || {};
        const patient =
          allPatients.find((pat) => pat._id === appointment.patientId[0]) || {};

        return {
          ...appointment,
          doctorName: doctor.name || "Unknown",
          doctorSpecialization: doctor.specialization || "N/A",
          patientName: patient.name || "Unknown",
          patientEmail: patient.email || "N/A",
          patientPhone: patient.phone || "N/A",
        };
      });

      setAppointments(enrichedAppointments);
      setIsLoading(false);
    }
  }, [allAppointments, allDoctors, allPatients]);

  // Second useEffect - fetches ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axios.get(`${backEndUrl}/doctor/get-all-ratings`);
        if (data) {
          setAllRatings(data);
        } else {
          toast.error("No ratings found");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    if (backEndUrl) {
      fetchRatings();
    }
  }, [backEndUrl]);

  // Third useEffect - combines appointments with ratings
  // FIX: Only depend on allRatings and the original data sources, not appointments itself
  useEffect(() => {
    if (allRatings.length > 0 && allAppointments && allDoctors && allPatients) {
      // Re-enrich appointments from scratch using original data sources
      const updatedAppointments = allAppointments.map((appointment) => {
        const doctor =
          allDoctors.find((doc) => doc._id === appointment.doctorId[0]) || {};
        const patient =
          allPatients.find((pat) => pat._id === appointment.patientId[0]) || {};
        const doctorRating =
          allRatings.find((rat) => rat._id === appointment.doctorId[0]) || {};

        return {
          ...appointment,
          doctorName: doctor.name || "Unknown",
          doctorSpecialization: doctor.specialization || "N/A",
          patientName: patient.name || "Unknown",
          patientEmail: patient.email || "N/A",
          patientPhone: patient.phone || "N/A",
          rating: doctorRating.averageRating  || "No rating",
        };
      });

      setAppointments(updatedAppointments);
    }
  }, [allRatings, allAppointments, allDoctors, allPatients]);

  // Filter appointments based on search and filter criteria
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentDate?.includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" ||
      appointment.status.toLowerCase() === filterStatus.toLowerCase();

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setSearchTerm("")}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg.Rating(⭐)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patientEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patientPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {appointment.doctorName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctorSpecialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.timeslot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1  text-xs  font-medium rounded-full bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {appointment.rating}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
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