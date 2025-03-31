import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { specializations } from "../assets/data/docAssets";
import { AppContext } from "../Context/AppContext";

const DoctorCard = () => {
  const { allDoctors, backEndUrl } = useContext(AppContext);
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);

  const specialists = specializations.map(
    (specialization) => specialization.title
  );

  // Improved filtering logic
  useEffect(() => {
    if (allDoctors.length === 0) return;

    const formattedSpeciality = speciality?.trim().toLowerCase();

    const filtered = allDoctors.filter((doc) => {
      // Handle both string and array specialties
      if (typeof doc.specialty === 'string') {
        return doc.specialty.trim().toLowerCase() === formattedSpeciality;
      } 
      
      if (Array.isArray(doc.specialty)) {
        return doc.specialty.some(
          spec => spec.trim().toLowerCase() === formattedSpeciality
        );
      }

      return false;
    });

    console.log("Filtering for:", formattedSpeciality);
    console.log("Filtered Doctors:", filtered);
    setFilterDoc(filtered);
  }, [speciality, allDoctors]);
  

  // (Optional) Debug logging of all doctors and current speciality
  useEffect(() => {
    console.log("Speciality from URL:", speciality);
  }, [speciality]);

  useEffect(() => {
    console.log("Available doctor specialties:", allDoctors.map(d => d.specialty));
  }, [allDoctors]);

  useEffect(() => {
    if (allDoctors.length === 0) {
      console.log("Doctors list is still loading...");
      return;
    }
  }, [allDoctors]);


  useEffect(() => {
    if (allDoctors.length === 0) {
      console.log("Doctors list is still loading...");
      return;
    }
  }, [allDoctors]);
    
  
  

  // Fetch all ratings and update each doctor object with averageRating and totalReviews
  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        const response = await axios.get(
          `${backEndUrl}/doctor/get-all-ratings`
        );
        const ratingsData = response.data;
        // Update allDoctors with rating info
        const updatedDoctors = allDoctors.map((doc) => {
          const ratingInfo = ratingsData.find(
            (r) => String(r._id) === String(doc._id)
          );
          return {
            ...doc,
            averageRating: ratingInfo ? ratingInfo.averageRating : 0,
            totalReviews: ratingInfo ? ratingInfo.totalReviews : 0,
          };
        });
        setFilterDoc(updatedDoctors);
      } catch (error) {
        console.error("Error fetching all ratings", error);
      }
    };

    if (allDoctors.length > 0) {
      fetchAllRatings();
    }
  }, [allDoctors, backEndUrl]);

  // Function to render Font Awesome stars based on rating
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(
          <i key={i} className="fa-solid fa-star text-yellow-500 text-lg"></i>
        );
      } else if (i - 0.5 === ratingValue) {
        stars.push(
          <i
            key={i}
            className="fa-solid fa-star-half-stroke text-yellow-500 text-lg"
          ></i>
        );
      } else {
        stars.push(
          <i key={i} className="fa-regular fa-star text-yellow-400 text-lg"></i>
        );
      }
    }
    return stars;
  };

  if (!allDoctors || allDoctors.length === 0) {
    return <p className="text-center text-gray-500">No doctors available.</p>;
  }

  return (
    <div className="flex mx-auto px-4">
      {/* Sidebar Filter */}
      <div>
        <p className="text-gray-600 mt-5 ml-3">
          Specialists Filter <i className="fa-solid fa-filter"></i>
        </p>
        <div className="flex flex-col items-start gap-3 ml-3 m-10 mt-5 mb-10">
          {specialists.slice(0, 8).map((specialist, index) => (
            <p
              key={index}
              onClick={() => {
                navigate(`/doctors/${specialist}`);
                window.scrollTo(0, 0);
              }}
              className={`w-[30vh] pl-3 py-1.5 pr-16 border-gray-300 cursor-pointer rounded-lg ${
                speciality === specialist
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              } hover:bg-blue-500 transition`}
            >
              {specialist}
            </p>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filterDoc.length > 0 ? (
          filterDoc.map((doctor) => {
            const doctorRating = {
              averageRating: doctor.averageRating || 0,
              totalReviews: doctor.totalReviews || 0,
            };

            return (
              <div
                key={doctor._id}
                className="w-[50vh] p-6 bg-white shadow-lg rounded-2xl transition-transform transform hover:-translate-y-3"
              >
                <img
                  className="w-full h-60 object-contain rounded-lg"
                  src={`${backEndUrl}/images/uploads/${doctor.image}`}
                  alt={doctor.name}
                />

                <div className="p-4 flex flex-col">
                  <h2 className="text-2xl font-semibold">{doctor.name}</h2>

                  <div className="flex justify-between mt-2">
                    <div className="text-blue-500 font-medium text-lg text-left">
                      {Array.isArray(doctor.specialty) ? (
                        doctor.specialty.map((specialist, index) => (
                          <p key={index}>{specialist}</p>
                        ))
                      ) : (
                        <p>{doctor.specialty}</p>
                      )}
                    </div>

                    <div className="text-gray-600 text-lg text-right">
                      <p>Exp: {doctor.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(doctorRating.averageRating)}
                    <span className="text-gray-600 text-lg ml-1">
                      ({doctorRating.totalReviews})
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigate(`/appointment/${doctor._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="mt-5 px-5 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No doctors available for this specialization.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
