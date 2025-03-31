import React, { useContext, useEffect, useState } from "react";
import { Users, Calendar, CheckSquare, AlertCircle, Ban } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

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

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientNames, setPatientNames] = useState([]);
  const { backEndUrl, allPatients } = useContext(AppContext);
  const { dToken } = useContext(DoctorContext); // Get dToken from DoctorContext

  useEffect(() => {
    //console.log("🔹 Token being sent:", dToken); // ✅ Check if token is defined

    if (!dToken) {
      console.log("❌ No token found! Ensure user is logged in.");
      return; // Prevent API call if token is missing
    }

    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `${backEndUrl}/doctor/get-my-appointment`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${dToken}` },
          }
        );

        //console.log("data",data)

        if (data) {
          setAppointments(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Error fetching doctor data"
        );
      }
    };

    fetchAppointment();
  }, [backEndUrl, dToken]);

  const completedAppointments = appointments.filter(
    (appt) => appt.status.toLowerCase() === "completed"
  ).length;
  const pendingAppointments = appointments.filter(
    (appt) => appt.status.toLowerCase() === "pending"
  ).length;
  const cancelledAppointments = appointments.filter(
    (appt) => appt.status.toLowerCase() === "cancelled"
  ).length;

  //console.log(appointment)

  const dashboardData = {
    totalAppointments: appointments.length || 0,
    completedAppointments: completedAppointments || 0,
    pendingAppointments: pendingAppointments || 0,
    cancelledAppointments: cancelledAppointments || 0,
  };

  //console.log(appointments);

  useEffect(() => {
    if (!appointments.length) return;

    const patientMap = {};
    appointments.forEach((appointment) => {
      const patient = appointment.patientId[0]; //this we got the whole patient detail

      //console.log("Patient id",patient)

      //const patient = allPatients.find(doc => doc._id === patientId);

      if (patient) {
        patientMap[appointment._id] = patient.name;
      }
    });

    setPatientNames(patientMap);
  }, [appointments]);

  //console.log(patientNames)

  const formattedDateTime = appointments?.appointmentDate
    ? `${new Date(appointments.appointmentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${appointments.timeslot}`
    : "Date not available";

  const latestAppointment = appointments.slice(-4).reverse(); // Get last 4 appointments

  return (
    <div className="p-4 bg-gray-50 w-full">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <SimpleCard
          title="Cancelled"
          count={dashboardData.cancelledAppointments}
          icon={<Ban size={24} className="text-orange-500" />}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Recent Appointments</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Patient</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {latestAppointment.length > 0 ? (
              latestAppointment.map((appointment) => (
                <tr key={appointment._id} className="border-b">
                  <td className="py-2">
                    {patientNames[appointment._id] || "Unknown"}
                  </td>
                  <td className="py-2">
                    {appointment?.appointmentDate
                      ? `${new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} at ${appointment.timeslot}`
                      : "Date not available"}
                  </td>

                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                      ${
                        appointment.status === "Completed"
                          ? "bg-green-300 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-blue-500 text-white"
                          : ""
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-2">
                  No Appointments Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
