import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctors } from "../assets/data/docAssets";

const RelatedDoc = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);

  useEffect(() => {
    const fetchDocInfo = async () => {
      const doc = doctors.find((doc) => doc._id == docId);
      setDocInfo(doc);
    };
    fetchDocInfo();
  }, [docId]);

  if (!docInfo) return <p className="text-center text-gray-500">Loading...</p>;

  const relatedDoctors = doctors.filter(
    (doc) => doc.speciality === docInfo.speciality && doc._id !== docInfo._id
  );

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
    <div className="flex flex-col items-center mt-20">
      <p className="text-3xl font-semibold text-blue-700 text-center">Related Doctors</p>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {relatedDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="w-[50vh] max-w-md p-6 bg-white shadow-lg rounded-2xl transform transition hover:-translate-y-3 text-center"
          >
            <img className="w-full h-60 object-contain rounded-lg mx-auto" src={doctor.image} alt={doctor.name} />

            <div className="p-4">
              <h2 className="text-2xl font-semibold">{doctor.name}</h2>

              <div className="flex justify-between mt-2 text-gray-600">
                <div className="text-blue-500 font-medium text-lg">
                  {Array.isArray(doctor.speciality) ? (
                    doctor.speciality.map((specialist, index) => <p key={index}>{specialist}</p>)
                  ) : (
                    <p>{doctor.speciality}</p>
                  )}
                </div>
                <p>Exp: {doctor.experience}</p>
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

export default RelatedDoc;
