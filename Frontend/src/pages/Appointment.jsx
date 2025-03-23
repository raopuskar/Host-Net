import React, { useEffect, useState, useContext } from "react";
import { useParams,useNavigate } from "react-router-dom";
import RelatedDoc from "../components/RelatedDoc";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { backEndUrl, token, doctor, getDoctorData } = useContext(AppContext);
  const { docId } = useParams();
  const navigate = useNavigate();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  useEffect(() => {
    //console.log("Received docId in Appointment:", docId);
    if (docId) {
      getDoctorData(docId);
    } else {
      console.error("docId is undefined in Appointment component");
    }
  }, [docId]);

  useEffect(() => {
    if (doctor) {
      getAvailableSlots();
    }
    //console.log("Doctor data in Appointment:", doctor);
  }, [doctor]);

  const setAppointment = async () => {
    try {

      if (!token) {
        toast.error("Login First")
        navigate("/login"); // Redirect if not logged in
        return;
      }
  
      if (!doctor || !docSlots[slotIndex]) {
        toast.error("Doctor information or slots not available");
        return;
      }

      const selectedSlot = docSlots[slotIndex].slots.find(
        (slot) => slot.time === slotTime
      );

      if (!selectedSlot) {
        toast.error("Please select a valid time slot");
        return;
      }

      const { data } = await axios.post(
        `${backEndUrl}/patient/book-appointment`,
        {
          doctorId: docId,
          appointmentDate: selectedSlot.datetime,
          timeslot: slotTime,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Appointment Booked Successfully");
      //console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getAvailableSlots = () => {
    setDocSlots([]); // Clear slots first
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [
        ...prev,
        {
          date: currentDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          slots: timeSlots,
        },
      ]);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < rating)
        return (
          <i key={i} className="fa-solid fa-star text-yellow-500 text-lg"></i>
        );
      if (i === Math.floor(rating) && rating % 1 !== 0)
        return (
          <i
            key={i}
            className="fa-solid fa-star-half-stroke text-yellow-500 text-lg"
          ></i>
        );
      return (
        <i key={i} className="fa-regular fa-star text-yellow-400 text-lg"></i>
      );
    });

  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(doctor?.reviews || []);
  
  //console.log(doctor.reviews)
  
  return (
    doctor && (
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row gap-4 m-10">
          <div>
            <img
              className="bg-primary w-[40vh] ml-5 sm:max-w-72 rounded-lg border border-red-400"
              src={`${backEndUrl}/images/uploads/${doctor?.image}`}
              alt={doctor?.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-6 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {doctor.name}
            </p>
            <div className="flex item-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {doctor.degree} - {doctor.specialty}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctor.experience} Year
              </button>
            </div>
            <div>
              <p className="flex item-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <i className="fa-solid fa-info text-xs"></i>
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {doctor.about}
              </p>
            </div>
            <p className="text-sm text-gray-900 mt-4">
              Appointment Fee:{" "}
              <span className="text-grey-600 text-base font-semibold text-primary">
                ₹{doctor.fees}
              </span>
            </p>
            <p className="text-sm text-gray-900 mt-4">Rating :</p>
            <div className="flex items-center gap-2 mt-2">
              {renderStars(averageRating)} 
              <span className="text-gray-600 text-lg ml-1">
                ({averageRating.toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slot</p>
          <div className="flex gap-4 mt-4 items-center w-full overflow-x-scroll">
            {docSlots.map((item, index) => (
              <div
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200"
                }`}
                onClick={() => setSlotIndex(index)}
              >
                <p>{daysOfWeek[item.slots[0]?.datetime.getDay()]}</p>
                <p>{item.slots[0]?.datetime.getDate()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 w-[81%] overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.slots.map((item, index) => (
              <p
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 border border-gray-300"
                }`}
                onClick={() => setSlotTime(item.time)}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button
            onClick={setAppointment}
            className="bg-blue-600 text-white text-sm mt-5 font-lighter px-14 py-3 rounded-full"
          >
            Book Appointment
          </button>
        </div>
        <RelatedDoc />
      </div>
    )
  );
};

export default Appointment;
