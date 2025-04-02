import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorProfile = () => {

  // State for profile image
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [imagePreview, setImagePreview] = useState(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState("personal");

  // State for form submission feedback
  const [successMessage, setSuccessMessage] = useState("");

  const [doctorId, setDoctorId] = useState(null);
  const [profile, setProfile] = useState({});


  const { backEndUrl, getDoctorData, doctors } = useContext(AppContext);
  const { dToken } = useContext(DoctorContext);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const { data } = await axios.get(`${backEndUrl}/doctor/get-id`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${dToken}` },
        });

        //console.log("Id",data)
  
        if (data) {
          setDoctorId(data); 
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Error fetching doctor data");
      }
    };
    fetchId();
  }, [backEndUrl, dToken]);
  

  //console.log(doctorId)

  //console.log(doctors)

  useEffect(() => {
    if (doctorId) {
      getDoctorData(doctorId);
    }
  }, [doctorId]);
  

  useEffect(() => {
    if (doctors && Object.keys(doctors).length > 0) {
      setProfile(doctors);
    }
  }, [doctors]);
  


  //console.log("Profile",profile)

  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file || !doctorId) return;
  
    const formData = new FormData();
    formData.append("profileImage", file);
  
    try {
      const { data } = await axios.put(
        `${backEndUrl}/doctor/upload-image/${doctorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
  
      setProfile((prev) => ({
        ...prev,
        image: data.imageUrl, // Ensure correct image URL
      }));
  
      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };
  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const { data } = await axios.put(
        `${backEndUrl}/doctor/update-profile/${doctorId}`,
        profile, // Send updated profile data
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }

      );
      //console.log(profile)
  
      // Update frontend state with the new profile data
      setProfile(data.updatedProfile);
      toast.success("Profile updated successfully!");
  
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  //console.log("Updated profile:",profile)
  


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
            <p>Update your professional information and settings</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-6">
              <p>{successMessage}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-1/3 p-6 bg-gray-50 border-r">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={profile.image ? `${backEndUrl}/images/uploads/${profile.image}` : "/api/placeholder/150/150"}
                      alt="Doctor profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 cursor-pointer"
                  >
                    Change Photo
                  </label>
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <h2 className="text-xl font-bold">{`Dr. ${profile.name} `}</h2>
                <p className="text-blue-600 font-medium">
                  {profile.specialty}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === "personal"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === "professional"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Professional Details
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === "contact"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Contact Information
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 p-6">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Tab */}
                {activeTab === "personal" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profile.name}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                          About
                        </label>
                        <textarea
                          name="about"
                          value={profile.about}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Details Tab */}
                {activeTab === "professional" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Specialization
                        </label>
                        <select
                          name="specialty"
                          value={profile.specialty}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Cardiology">Cardiology</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Oncology">Oncology</option>
                          <option value="Orthopedics">Orthopedics</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          License Number
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={profile.licenseNumber}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed opacity-50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Hospital/Clinic
                        </label>
                        <input
                          type="text"
                          name="hospital"
                          value={profile.hospital}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={profile.experience}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Education
                        </label>
                        <input
                          type="text"
                          name="education"
                          value={profile.education}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 bg-gray-100 cursor-not-allowed opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Consultation Fee (₹)
                        </label>
                        <input
                          type="number"
                          name="fees"
                          value={profile.fees}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information Tab */}
                {activeTab === "contact" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border border-gray-300 bg-gray-100 cursor-not-allowed opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border bg-gray-100 cursor-not-allowed opacity-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={profile.zip}
                          onChange={handleInputChange}
                          disabled
                          className="w-full p-3 border bg-gray-100 cursor-not-allowed opacity-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-300 rounded-lg mr-4 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
