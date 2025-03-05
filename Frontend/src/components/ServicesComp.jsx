import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { specializations } from '../assets/data/docAssets';


const ServicesComp = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  return (
    <div className='py-16 bg-gradient-to-b from-[#63c1d5] to-white'>
      <h2 className='text-4xl font-bold text-center text-gray-800 mb-10'>
        Our Specializations
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8'>
        {specializations.slice(0,4).map((specialty, index) => (
          <div key={index} className='bg-white rounded-lg shadow-lg p-5 hover:scale-105 transform transition-transform duration-300'>
            <img src={specialty.image} alt={specialty.title} className='w-full h-40 object-cover rounded-md' />
            <h3 className='text-xl font-semibold text-gray-800 mt-4'>{specialty.title}</h3>
            <p className='text-gray-600 mt-2'>{specialty.description}</p>
            <button onClick={()=>{ navigate(`/doctors/${encodeURIComponent(specialty.title)}`);window.scroll(0,0)}} className='mt-4 px-4 py-2 bg-[#63c1d5] text-white rounded-md hover:bg-[#519dac] transition-colors'>
              View More
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-11">
  <button 
    onClick={() => {navigate('/services');
                   window.scrollTo(0, 0);
    }}
    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
  >
    See All
  </button>
</div>
    </div>
  );
};

export default ServicesComp;
