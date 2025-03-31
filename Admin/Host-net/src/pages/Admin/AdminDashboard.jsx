import React, { useContext, useEffect,useState } from 'react';
import { Users, Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

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

  const { allDoctors,allAppointments,allPatients } = useContext(AppContext);
  const [doctorNames, setDoctorNames] = useState({});
  const [patientNames, setPatientNames] = useState({});

  // useEffect(() => {
  //   try {
  //     console.log("Total doctors:", allDoctors.length);
  //   } catch (error) {
  //     console.error("Error fetching doctors:", error);
  //   }
  // }, [allDoctors]);


  //I can do this way or fetch data from backend like allconctor from appcontext
  const completedAppointments = allAppointments.filter(appt => appt.status === "Completed").length;
  const pendingAppointments = allAppointments.filter(appt => appt.status === "pending").length;

  const dashboardData = {
    doctorCount:  allDoctors.length || 0,
    totalAppointments: allAppointments.length || 0,
    completedAppointments: completedAppointments,
    pendingAppointments: pendingAppointments
  };

  //console.log(allAppointments)
  
  useEffect(() => {
    if (!allDoctors.length || !allAppointments.length) return;
  
    const doctorMap = {};
    const patientMap = {}
    allAppointments.forEach((appointment) => {
      const doctorId = appointment.doctorId[0]; // Access the first element of the array
      const patientId = appointment.patientId[0];

      //console.log(allPatients)

      const doctor = allDoctors.find(doc => doc._id === doctorId);
      const patient = allPatients.find(doc => doc._id === patientId);
  
      if (doctor) {
        patientMap[appointment._id] = patient.name;
      }

      if (patient) {
        doctorMap[appointment._id] = doctor.name;
      }
      
    });
  
    setDoctorNames(doctorMap);
    setPatientNames(patientMap);

  }, [allDoctors,allPatients, allAppointments]);

  // console.log("All Patients in AdminDashboard:", allPatients);
  // console.log("Is allPatients an array?", Array.isArray(allPatients));


  const latestAppointment = allAppointments.slice(-4).reverse(); // Get last 4 appointments

  

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
          icon={<AlertCircle size={24} className="bg-blue-100 text-white-800" />} 
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
            {latestAppointment.length > 0 ? (
              latestAppointment.map((appointment) => (
                <tr key={appointment._id} className="border-b">
                  <td className="py-2">{patientNames[appointment._id] || "Unknown"}</td>
                  <td className="py-2">{doctorNames[appointment._id] || "Unknown"}</td>
                  <td className="py-2">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${appointment.status === "Completed" ? "bg-green-100 text-green-800" :
                        appointment.status === "pending" ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-2">No Appointments Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;