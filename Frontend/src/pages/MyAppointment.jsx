import React, { useState, useEffect } from "react";
import { doctors } from "../assets/data/docAssets";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Load appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = () => {
      // Assuming "doctors" array contains doctor details
      const sampleAppointments = doctors.map((doc, index) => ({
        id: index + 1,
        doctor: doc.name,
        specialization: doc.specialization,
        date: "2024-03-15", // Example date
        time: "10:30 AM", // Example time
        image: doc.image || "https://via.placeholder.com/80", // Default image if not available
        status: index % 2 === 0 ? "past" : "upcoming", // Alternate past & upcoming
        rating: null,
        review: "",
      }));
      setAppointments(sampleAppointments);
    };

    fetchAppointments();
  }, []);

  const handleRatingChange = (id, rating) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, rating } : appt))
    );
  };

  const handleReviewChange = (id, review) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, review } : appt))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <div className="w-full max-w-3xl">
        {appointments.length > 0 ? (
          appointments.slice(0,2).map((appt) => (
            <div
              key={appt.id}
              className="bg-white shadow-lg rounded-xl p-5 mb-6 flex items-center gap-5"
            >
              {/* Doctor Image */}
              <img
                src={appt.image}
                alt={appt.doctor}
                className="w-20 h-20 rounded-full object-contain border-2 border-blue-500"
              />

              {/* Appointment Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{appt.doctor}</h2>
                <p className="text-gray-600">{appt.specialization}</p>
                <p className="text-sm text-gray-500">
                  {appt.date} at {appt.time}
                </p>
              </div>

              {/* Past Appointment - Rating & Review */}
              {appt.status === "past" ? (
                <div className="w-1/3">
                  <label className="text-sm font-medium">Rate Doctor:</label>
                  <select
                    value={appt.rating || ""}
                    onChange={(e) =>
                      handleRatingChange(appt.id, e.target.value)
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
                    value={appt.review}
                    onChange={(e) =>
                      handleReviewChange(appt.id, e.target.value)
                    }
                    placeholder="Write a review..."
                    className="w-full mt-2 p-2 border rounded-lg resize-none"
                    rows="2"
                  />
                </div>
              ) : (
                <div className="text-blue-500 p-10 font-medium">Upcoming</div>
              )}

              {appt.status !== "past" && (
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
          ))
        ) : (
          <p className="text-gray-600 text-lg">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Appointments;
