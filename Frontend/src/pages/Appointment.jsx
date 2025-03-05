import React, { useEffect, useState } from "react";
import { doctors } from "../assets/data/docAssets";
import { useParams } from "react-router-dom";
import RelatedDoc from '../components/RelatedDoc'

const Appointment = () => {
  const { docId } = useParams();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id == docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]); //clear the slot first

    //Getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      //Setting and time of the date with index

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //setting hours
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
        let formattedTime = currentDate.toLocaleString("en-US", {
          // weekday: "short",
          // month: "short",
          // day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        //add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        //Increment current time by 30 minutes
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

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]); //koi bhi dono mein se change ho toh useEffect chalega

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]); //jab docInfo change hoga toh useEffect chalega

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

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
    docInfo && ( //mean only display only of doctor is present
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row gap-4 m-10">
          <div>
            <img
              className="bg-primary w-[40vh] ml-5 sm:max-w-72 rounded-lg border border-red-400"
              src={docInfo?.image}
              alt={docInfo?.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-6 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
            </p>
            <div className="flex item-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex item-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <i class="fa-solid fa-info text-xs "></i>
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-sm text-gray-900 mt-4">
              Appointment Fee:{" "}
              <span className="text-grey-600 text-base font-semibold text-primary">
                ₹{docInfo.fees}
              </span>
            </p>

            <p className="text-sm text-gray-900 mt-4">Rating :</p>
            <div className="flex items-center gap-2 mt-2">
                {renderStars(docInfo.rating)}
                <span className="text-gray-600 text-lg ml-1">({docInfo.rating})</span>
              </div>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slot</p>
          <div className="flex gap-4 mt-4 items-center w-full overflow-x-scroll">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200"
                  }`}
                  onClick={() => setSlotIndex(index)}
                >
                  <p>
                    {item.slots[0] &&
                      daysOfWeek[item.slots[0].datetime.getDay()]}
                  </p>
                  <p>{item.slots[0] && item.slots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-[81%] overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex].slots.map((item, index) => (
                <p
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 border border-gray-300"
                  }`}
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className="bg-blue-600 text-white text-sm mt-5 font-lighter px-14 py-3 rounded-full">Book Appointment</button>
        </div>
        <RelatedDoc />
      </div>
    )
  );
};

export default Appointment;
