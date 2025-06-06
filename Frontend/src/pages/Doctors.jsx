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
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const specialists = specializations.map(
    (specialization) => specialization.title
  );

  // Search handler function
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Improved filtering logic with search functionality
  useEffect(() => {
    if (allDoctors.length === 0) return;

    const formattedSpeciality = speciality?.trim().toLowerCase();
    const formattedQuery = searchQuery.trim().toLowerCase();

    const filtered = allDoctors.filter((doc) => {
      // Check for the query in name, specialty
      const matchesName = doc.name.toLowerCase().includes(formattedQuery);
      const matchesSpecialty = Array.isArray(doc.specialty)
        ? doc.specialty.some(spec => spec.toLowerCase().includes(formattedQuery))
        : doc.specialty.toLowerCase().includes(formattedQuery);
      const matchesRating =
        doc.averageRating && doc.averageRating.toString().includes(formattedQuery);

      return (
        (matchesName || matchesSpecialty || matchesRating) &&
        (formattedSpeciality
          ? (Array.isArray(doc.specialty)
              ? doc.specialty.some(spec => spec.toLowerCase() === formattedSpeciality)
              : doc.specialty.toLowerCase() === formattedSpeciality)
          : true)
      );
    });

    console.log("Filtering for:", formattedQuery);
    console.log("Filtered Doctors:", filtered);
    setFilterDoc(filtered);
  }, [speciality, searchQuery, allDoctors]);

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
    <div className="flex flex-col mx-auto px-4">
      {/* Search Bar */}
      <div className="flex justify-center mt-4 w-full">
        <input
          type="text"
          placeholder="Search by name, specialization..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-3 w-1/2 max-w-lg border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"        />
      </div>

      <div className="flex">
        {/* Sidebar Filter */}
        <div>
          <p className="text-gray-600 ml-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
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
    </div>
  );
};

export default DoctorCard;
