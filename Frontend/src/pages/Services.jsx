import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { specializations } from '../assets/data/docAssets';


const Services = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();


  return (
    <div className='py-16 bg-gradient-to-b from-[#63c1d5] to-white'>
      <h2 className='text-4xl font-bold text-center text-gray-800 mb-10'>
        All Our Specializations
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8'>
        {specializations.map((specialty, index) => (
          <div key={index} className='bg-white rounded-lg shadow-lg p-5 hover:scale-105 transform transition-transform duration-300'>
            <img src={specialty.image} alt={specialty.title} className='w-full h-40 object-cover rounded-md' />
            <h3 className='text-xl font-semibold text-gray-800 mt-4'>{specialty.title}</h3>
            <p className='text-gray-600 mt-2'>{specialty.description}</p>
            <button onClick={()=> navigate(`/doctors/${encodeURIComponent(specialty.title)}`)}  className='mt-4 px-4 py-2 bg-[#63c1d5] text-white rounded-md hover:bg-[#519dac] transition-colors'>
              View More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
