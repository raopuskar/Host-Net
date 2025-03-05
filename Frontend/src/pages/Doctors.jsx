import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctors } from "../assets/data/docAssets";
import { specializations } from "../assets/data/docAssets";

const DoctorCard = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState(doctors);

  const specialists = specializations.map((specialization) => specialization.title);

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [speciality]);

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

  return (
    <div className="flex mx-auto px-4">
      <div className="">
      <p className=" text-gray-600 mt-5 ml-3">Specialists Filter <i class="fa-solid fa-filter"></i></p>

      <div className="flex flex-col items-start gap-3 ml-3 m-10 mt-5 mb-10">
        {specialists.slice(0,8).map((specialist, index) => (
          <p
            key={index}
            onClick={() => navigate(`/doctors/${specialist}`)}
            className={`w-[30vh] pl-3 py-1.5 pr-16 border-gray-300 cursor-pointer rounded-lg ${
              speciality === specialist ? "bg-blue-600 text-white" : "bg-gray-200"
            } hover:bg-blue-500 transition`}
          >
            {specialist}
          </p>
        ))}
      </div>
      </div>

      

      {/* Doctors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filterDoc.map((doctor) => (
          <div
            key={doctor.id}
            className="w-[50vh] p-6 bg-white shadow-lg rounded-2xl transition-transform transform hover:-translate-y-3"
          >
            <img className="w-full h-60 object-contain rounded-lg" src={doctor.image} alt={doctor.name} />

            <div className="p-4 flex flex-col">
              <h2 className="text-2xl font-semibold">{doctor.name}</h2>

              <div className="flex justify-between mt-2">
                {/* Specialties (Left Aligned) */}
                <div className="text-blue-500 font-medium text-lg text-left">
                  {Array.isArray(doctor.speciality) ? (
                    doctor.speciality.map((specialist, index) => <p key={index}>{specialist}</p>)
                  ) : (
                    <p>{doctor.speciality}</p>
                  )}
                </div>

                {/* Experience & Rating (Right Aligned) */}
                <div className="text-gray-600 text-lg text-right">
                  <p>Exp: {doctor.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                {renderStars(doctor.rating)}
                <span className="text-gray-600 text-lg ml-1">({doctor.rating})</span>
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
        ))}
      </div>
    </div>
  );
};

export default DoctorCard;
