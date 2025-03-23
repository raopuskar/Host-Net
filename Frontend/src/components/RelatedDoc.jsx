import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const RelatedDoc = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { backEndUrl, doctor,allDoctors, getDoctorData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);

  useEffect(() => {
    if (docId) {
      getDoctorData(docId);
    }
  }, [docId]);

  useEffect(() => {
    if (doctor) {
      setDocInfo(doctor);
    }
  }, [doctor]);

  if (!docInfo) return <p className="text-center text-gray-500">Loading...</p>;

  const relatedDoctors = allDoctors.filter(
    (doc) => doc.specialty === doctor.specialty && doc._id !== doctor._id
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < rating) return <i key={i} className="fa-solid fa-star text-yellow-500 text-lg"></i>;
      if (i === Math.floor(rating) && rating % 1 !== 0)
        return <i key={i} className="fa-solid fa-star-half-stroke text-yellow-500 text-lg"></i>;
      return <i key={i} className="fa-regular fa-star text-yellow-400 text-lg"></i>;
    });
  };

  if(relatedDoctors.length==0){
    <h2>No Related Doctor</h2>
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <p className="text-3xl font-semibold text-blue-700 text-center">Related Doctors</p>

      {relatedDoctors.length === 0 ? (
        <h2 className="text-gray-500 mt-4">No Related Doctors</h2>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {relatedDoctors.map((doc) => (
            <div
              key={doc._id}
              className="w-[50vh] max-w-md p-6 bg-white shadow-lg rounded-2xl transform transition hover:-translate-y-3 text-center"
            >
              <img
                className="w-full h-60 object-contain rounded-lg mx-auto"
                src={`${backEndUrl}/images/uploads/${doc.image}`}
                alt={doc.name}
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold">{doc.name}</h2>
                <div className="flex justify-between mt-2 text-gray-600">
                  <div className="text-blue-500 font-medium text-lg">
                    {Array.isArray(doc.specialty) ? (
                      doc.specialty.map((specialty, index) => <p key={index}>{specialty}</p>)
                    ) : (
                      <p>{doc.specialty}</p>
                    )}
                  </div>
                  <p>Exp: {doc.experience}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(doc.rating)}
                  <span className="text-gray-600 text-lg ml-1">({doc.rating})</span>
                </div>
                <button
                  onClick={() => {
                    navigate(`/appointment/${doc._id}`);
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
      )}
    </div>
  );
};

export default RelatedDoc;