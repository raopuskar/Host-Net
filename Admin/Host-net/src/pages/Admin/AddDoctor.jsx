import React, { useContext,useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { aToken,backendUrl } = useContext(AdminContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    location: '',
    experience: '',
    about: '',
    fees: '',
    date: '',
    image: null,
    availability: [
      { day: 'Monday', timeSlots: [] },
      { day: 'Tuesday', timeSlots: [] },
      { day: 'Wednesday', timeSlots: [] },
      { day: 'Thursday', timeSlots: [] },
      { day: 'Friday', timeSlots: [] },
      { day: 'Saturday', timeSlots: [] },
      { day: 'Sunday', timeSlots: [] }
    ]
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle time slot changes
  const handleTimeSlotChange = (day, e) => {
    const slots = e.target.value.split(',').map(slot => slot.trim());
    
    const updatedAvailability = formData.availability.map(item => {
      if (item.day === day) {
        return { ...item, timeSlots: slots };
      }
      return item;
    });

    setFormData({
      ...formData,
      availability: updatedAvailability
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    // Check if token exists
    if (!aToken) {
      toast('You must be logged in to add a doctor');
      return;
    }



    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all text fields
      for (const key in formData) {
        if (key !== 'image' && key !== 'availability') {
          submitData.append(key, formData[key]);
        }
      }
      
      // Append image file
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // Append availability as JSON string
      submitData.append('availability', JSON.stringify(formData.availability));
      
      // Send data to API
      const response = await axios.post(backendUrl + '/admin/add-doctor', submitData, {
        useCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${aToken}` // Use aToken here
        }
      });
      
      toast.success('Doctor profile added successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        password: '',
        specialty: '',
        location: '',
        experience: '',
        about: '',
        fees: '',
        date: '',
        image: null,
        availability: [
          { day: 'Monday', timeSlots: [] },
          { day: 'Tuesday', timeSlots: [] },
          { day: 'Wednesday', timeSlots: [] },
          { day: 'Thursday', timeSlots: [] },
          { day: 'Friday', timeSlots: [] },
          { day: 'Saturday', timeSlots: [] },
          { day: 'Sunday', timeSlots: [] }
        ]
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding doctor:', error);
      console.log(error.response.data.message);
      toast.error('Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Doctor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Specialty*</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          {/* Professional Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Experience (years)*</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                min="0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Consultation Fees*</label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                min="0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Start Date*</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">About/Bio*</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="5"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Profile Image */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Upload a professional photo</p>
            </div>
            {imagePreview && (
              <div className="w-24 h-24 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Availability */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Availability</h2>
          <p className="text-sm text-gray-600 mb-3">Enter available time slots separated by commas (e.g. "9:00 AM-10:00 AM, 2:00 PM-4:00 PM")</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.availability.map((item) => (
              <div key={item.day} className="mb-3">
                <label className="block text-gray-700 mb-2">{item.day}</label>
                <input
                  type="text"
                  value={item.timeSlots.join(', ')}
                  onChange={(e) => handleTimeSlotChange(item.day, e)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. 9:00 AM-10:00 AM, 2:00 PM-4:00 PM"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding Doctor...' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;