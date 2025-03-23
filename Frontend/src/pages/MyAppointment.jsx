import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
//import { doctors } from "../assets/data/docAssets";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorsData, setDoctorsData] = useState({}); // Store doctors data by ID
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const { token, backEndUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch Appointments
  const fetchAppointment = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/patient/my-appointment`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data) {
        setAppointments(data);
      } else {
        toast.error("Error fetching appointment");
      }
      //onsole.log("Data",data)
      //console.log("Appoinmrnt",appointments)
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load appointments");
    }
  };

  // Fetch doctor data by ID - updated to use the correct endpoint
  const fetchDoctorData = async (doctorId) => {
    try {
      // Use the correct API endpoint based on your server routes
      const { data } = await axios.get(
        `${backEndUrl}/doctor/get-profile/${doctorId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setDoctorsData((prev) => ({
          ...prev,
          [doctorId]: data.data,
        }));
      }

      //console.log("Doctor data",data.data)
    } catch (error) {
      console.error(`Error fetching doctor data for ID ${doctorId}:`, error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointment();
    }else{
      console.log("Fetch appoitmnt not working")
    }
  }, [backEndUrl, token]);

  //console.log("Appointments",appointments)

  // Fetch doctors for each appointment
  useEffect(() => {
    if (appointments.length > 0) {
      // Create a Set to avoid duplicate requests
      const doctorIds = new Set();

      appointments.forEach((appt) => {
        // Extract doctor ID from the array
        if (
          appt.doctorId &&
          Array.isArray(appt.doctorId) &&
          appt.doctorId.length > 0
        ) {
          // Try to get _id directly or from first element if it's an object
          let doctorId;
          if (typeof appt.doctorId[0] === "string") {
            doctorId = appt.doctorId[0];
          } else if (appt.doctorId[0]._id) {
            doctorId = appt.doctorId[0]._id;
          }

          if (doctorId && !doctorsData[doctorId]) {
            doctorIds.add(doctorId);
          }
        }
      });

      // Fetch data for each unique doctor ID
      doctorIds.forEach((id) => {
        fetchDoctorData(id);
      });
    }
  }, [appointments]);

  // Handle Rating Change
  const handleRatingChange = (id, rating) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt._id === id ? { ...appt, rating } : appt))
    );
  };

  // Handle Review Change
  const handleReviewChange = (id, review) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt._id === id ? { ...appt, review } : appt))
    );
  };

  // Cancel Appointment
  const handleCancelAppointment = async (id) => {
    const isConfirmed = window.confirm(
      "Do you really want to cancel the appointment?"
    );

    if (!isConfirmed) return; // Stop if the user cancels the confirmation

    try {
      await axios.delete(`${backEndUrl}/patient/cancel-appointment/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Appointment canceled successfully");
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (error) {
      toast.error("Error canceling appointment");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Helper to extract doctor ID safely
  const getDoctorId = (doctorIdArray) => {
    if (Array.isArray(doctorIdArray) && doctorIdArray.length > 0) {
      if (typeof doctorIdArray[0] === "string") {
        return doctorIdArray[0];
      } else if (doctorIdArray[0] && doctorIdArray[0]._id) {
        return doctorIdArray[0]._id;
      }
    }
    return null;
  };

  // Add this useEffect to separate past and upcoming appointments
useEffect(() => {
  if (appointments.length > 0) {
    const current = new Date();
    
    const past = appointments.filter(
      (appt) => new Date(appt.appointmentDate) < current
    );
    
    const upcoming = appointments.filter(
      (appt) => new Date(appt.appointmentDate) >= current
    );
    
    setPastAppointments(past);
    setUpcomingAppointments(upcoming);
  }
}, [appointments]);


// Add this function to handle review submission
const submitReview = async (appointmentId) => {
  const appointment = appointments.find((appt) => appt._id === appointmentId);
  
  if (!appointment) return;

  // Get the doctor ID directly from the appointment
  const doctorId = getDoctorId(appointment.doctorId);
  
  if (!doctorId) {
    toast.error("Doctor information not found");
    return;
  }

  console.log(appointment)
  console.log(appointment.rating)
  console.log(appointment.review)
  console.log(appointment.doctorId || doctorsData.id)
  console.log(appointmentId)

  
  try {
    await axios.post(
      `${backEndUrl}/patient/submit-review`,
      {
        rating: appointment.rating,
        review: appointment.review,
        doctorId: appointment.doctorId || doctorsData.id,
        appointmentId: appointmentId
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    toast.success("Review submitted successfully");
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error("Failed to submit review");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <div className="w-full max-w-3xl">
        {[...upcomingAppointments, ...pastAppointments].map((appt) => {     //Combine in single array to ensure that upcoming appear first
          const doctorId = getDoctorId(appt.doctorId);
          const doctor = doctorId ? doctorsData[doctorId] || {} : {};  //If not available it will return {} 
          const isPast = new Date(appt.appointmentDate) < new Date();  //If the appointment date is before today, it marks it as past

          return (
            <div
              key={appt._id}
              className="bg-white shadow-lg rounded-xl p-5 mb-6 flex items-center gap-5"
            >
              {/* Doctor Image */}
              <img
                src={
                  doctor.image
                    ? `${backEndUrl}/images/uploads/${doctor.image}`
                    : "/default-doctor.png"
                }
                alt={doctor.name || "Doctor"}
                className="w-20 h-20 rounded-full object-contain border-2 border-blue-500"
              />

              {/* Appointment Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {doctor.name || "Loading doctor info..."}
                </h2>
                <p className="text-gray-600">{doctor.specialty || "N/A"}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(appt.appointmentDate)} at {appt.timeslot}
                </p>
              </div>

              {/* Section to display status and actions */}
              {isPast ? (
                // Past Appointment - Show Rating & Review
                <div className="w-1/3">
                  <label className="text-sm font-medium">Rate Doctor:</label>
                  <select
                    value={appt.rating || ""}
                    onChange={(e) =>
                      handleRatingChange(appt._id, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg mt-1"
                  >
                    <option value="">Select Rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                  </select>

                  <textarea
                    value={appt.review || ""}
                    onChange={(e) =>
                      handleReviewChange(appt._id, e.target.value)
                    }
                    placeholder="Write a review..."
                    className="w-full mt-2 p-2 border-blue-600 rounded-lg resize-none"
                    rows="2"
                  />
                  <button
                    onClick={() => submitReview(appt._id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                // Upcoming Appointment - Show "Upcoming" Status
                <div className="text-blue-500 p-10 font-medium">Upcoming</div>
              )}

              {/* Buttons for Upcoming Appointments */}
              {!isPast && (
                <div className="flex flex-col gap-4">
                  <button className="border-2 px-2 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-300">
                    Pay Online
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(appt._id)}
                    className="border-2 px-2 py-2 rounded-lg hover:bg-red-700 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;
