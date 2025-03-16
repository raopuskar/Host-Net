import React, { useState } from 'react';

const DoctorProfile = () => {
  // Initial state for the doctor's profile information
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'dr.john.smith@medical.com',
    phone: '(555) 123-4567',
    specialization: 'Cardiology',
    licenseNumber: 'MD12345678',
    hospital: 'City General Hospital',
    address: '123 Medical Center Dr.',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    education: 'Harvard Medical School',
    yearsOfExperience: '15',
    languages: ['English', 'Spanish'],
    bio: 'Board-certified cardiologist with 15 years of experience specializing in preventive cardiology and heart disease management.',
    consultationFee: '200'
  });

  // State for profile image
  const [profileImage, setProfileImage] = useState('/api/placeholder/150/150');
  const [imagePreview, setImagePreview] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for form submission feedback
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, you would send the data to an API here
    console.log('Submitting updated profile:', profile);
    
    if (imagePreview) {
      setProfileImage(imagePreview);
      setImagePreview(null);
    }
    
    // Show success message
    setSuccessMessage('Profile updated successfully!');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Add a language
  const [newLanguage, setNewLanguage] = useState('');
  
  const addLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  // Remove a language
  const removeLanguage = (lang) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(language => language !== lang)
    }));
  };

  // Handle key press for adding languages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

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
                      src={imagePreview || profileImage} 
                      alt="Doctor profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label htmlFor="profile-image" className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 cursor-pointer">
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
                <h2 className="text-xl font-bold">{`Dr. ${profile.firstName} ${profile.lastName}`}</h2>
                <p className="text-blue-600 font-medium">{profile.specialization}</p>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('personal')} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'personal' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  Personal Information
                </button>
                <button 
                  onClick={() => setActiveTab('professional')} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'professional' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  Professional Details
                </button>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'contact' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  Contact Information
                </button>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="md:w-2/3 p-6">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Languages</label>
                        <div className="mb-2 flex flex-wrap">
                          {profile.languages.map((lang, index) => (
                            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
                              {lang}
                              <button
                                type="button"
                                onClick={() => removeLanguage(lang)}
                                className="ml-2 text-gray-600 hover:text-red-600"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a language"
                          />
                          <button
                            type="button"
                            onClick={addLanguage}
                            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Biography</label>
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Professional Details Tab */}
                {activeTab === 'professional' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                        <select
                          name="specialization"
                          value={profile.specialization}
                          onChange={handleInputChange}
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
                        <label className="block text-gray-700 font-medium mb-2">License Number</label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={profile.licenseNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Hospital/Clinic</label>
                        <input
                          type="text"
                          name="hospital"
                          value={profile.hospital}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={profile.yearsOfExperience}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Education</label>
                        <input
                          type="text"
                          name="education"
                          value={profile.education}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Consultation Fee ($)</label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={profile.consultationFee}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Information Tab */}
                {activeTab === 'contact' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">State/Province</label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">ZIP/Postal Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={profile.zip}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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