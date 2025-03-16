import React, { useState, useContext, useEffect } from "react";
import profilePic from "../assets/profile_pic/p1.webp";
import pp from "../assets/profile_pic/template_3.jpg";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const MyProfile = () => {
  const [profileImage, setProfileImage] = useState(profilePic);
  const { userData, setUserData, token, backEndUrl,loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;


  //Set initial profile image if user has one
  useEffect(() => {
    if (userData && userData.image) {
      setProfileImage(userData.image);
    }
  }, [userData]);

  // useEffect(() => {
  //   if (userData?.image) {
  //     setProfileImage(userData.image);
  //   }
  // }, [userData.image]);

  
  // useEffect(() => {
  //   //console.log("Updated User Data:", userData);
  // }, [userData]);
  

  //console.log("User Data:", userData);

  // Handle input change
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
          `${backEndUrl}/patient/my-profile`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data) {
          const updatedImageURL = `${response.data.user.image.replace(/^\/?/, '')}`;
          // console.log(response.data.user.image);
          // console.log("Updated Image URL:", updatedImageURL);
          // console.log(profileImage)
          setProfileImage(updatedImageURL);
          toast.success('Profile picture updated successfully');
          loadUserProfileData(); // Reload user data
        } else {
          toast.error(response.data.message || 'Failed to update profile picture');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        toast.error(error.response?.data?.message || 'Error updating profile picture');
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backEndUrl}/patient/my-profile`,
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Log the entire response to see its structure
      //Debuging
      // console.log("Full API Response:", response);
      // console.log("Response Status:", response.status);
      // console.log("Response Headers:", response.headers);
      // console.log("Response Data:", response.data);
      // console.log("Request URL:", `${backEndUrl}/patient/my-profile`);
      // console.log("Request Headers:", { Authorization: `Bearer ${token}` });
      // console.log("Request Data:", userData);



      // Then check if response.data.user exists
      if (response.status === 200 && response.data) {
        setUserData(response.data.user || response.data); // Updates user data directly
        toast.success('Profile updated successfully');
        loadUserProfileData(); // Reloading user data
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (!userData) {
    return <div className="text-center mt-8">Loading...</div>;
  
  }

  //console.log("User Data:", userData.image);

  // useEffect(() => {
  //   console.log("Updated User Data:", userData);
  // }, [userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          My Profile
        </h2>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
        <img 
          src={userData.image.startsWith("http") ? userData.image : `http://localhost:3000/${userData.image}`}   //user data https se start hi nhi ho raha tha 
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500" 
        />

          <label className="mt-3 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Change Picture
            <input 
              type="file" 
              className="hidden" 
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        </div>

        {/* Profile Form */}
        <form className="mt-6 space-y-4 " onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              readOnly // Email should typically not be editable
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={userData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={userData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
