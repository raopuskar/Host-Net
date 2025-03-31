import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Missing import
import { AppContext } from '../Context/AppContext';

// Function to render Font Awesome stars based on rating
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className="fa-solid fa-star text-yellow-500 text-lg"></i>);
    } else if (i - 0.5 === rating) {
      stars.push(<i key={i} className="fa-solid fa-star-half-stroke text-yellow-500 text-lg"></i>);
    } else {
      stars.push(<i key={i} className="fa-regular fa-star text-yellow-400 text-lg"></i>);
    }
  }
  return stars;
};

const TopDoctors = () => {
  const navigate = useNavigate();
  const { setAllDoctors, allDoctors, backEndUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/doctor/get-all-ratings`);
        const ratingsData = response.data;

        const updatedDoctors = allDoctors.map((doc) => {
          const ratingInfo = ratingsData.find((r) => String(r._id) === String(doc._id));
          return {
            ...doc,
            averageRating: ratingInfo ? ratingInfo.averageRating : 0,
            totalReviews: ratingInfo ? ratingInfo.totalReviews : 0,
          };
        });

        setAllDoctors(updatedDoctors);
      } catch (error) {
        console.error("Error fetching all ratings", error);
      }
    };

    if (allDoctors.length > 0) {
      fetchAllRatings();
    }
  }, [allDoctors, backEndUrl]);

  const filteredDoctors = allDoctors
  .filter((doctor) => doctor.averageRating > 4) // ✅ Only doctors with rating > 4
  .slice(0, 4); // ✅ Limit to max 4 doctors

  return (
    <div className="flex flex-col items-center justify-center gap-10 text-gray-900 py-12">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">Top Doctors</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-3"
          >
            <img
              className="w-full h-60 object-contain rounded-lg"
              src={`${backEndUrl}/images/uploads/${doctor.image}`}
              alt={doctor.name}
            />
  
            <div className="p-4 flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">{doctor.name}</h2>
              <p className="text-gray-600 text-lg">Experience: {doctor.experience} Years</p>
              <p className="text-blue-500 font-medium text-lg">{doctor.specialty}</p>
  
              <div className="flex items-center gap-2 mt-2">
                {renderStars(doctor.averageRating)}
                <span className="text-gray-600 text-lg ml-1">({doctor.averageRating})</span>
              </div>
  
              <button
                onClick={() => navigate(`./appointment/${doctor._id}`)}
                className="mt-5 px-5 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default TopDoctors;
