import React from 'react';
import Homelogo from '../assets/images/home.png';
import { Link } from 'react-router-dom';
import ServicesComp from '../components/ServicesComp';
import TopDoctors from '../components/TopDoctors';
import AboutScroll from '../components/AboutScroll';


function Home() {
  return (
    <>
      <div className="relative w-full h-[90vh]">
        
        <img className="absolute inset-0 w-full h-full object-cover" src={Homelogo} alt="home-logo" />

        
        <div className="absolute inset-0 flex flex-col items-start justify-center pl-20 space-y-6">
          <h1 className="text-white text-5xl font-bold leading-tight">
            Caring for you,<br />every step of the way.
          </h1>
          
          <h4 className="text-blue-800 text-xl font-medium">
            Book Your Appointment Today
          </h4>

          <Link to={'/services'}>
            <button className="px-6 py-3 bg-sky-950 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300">
              Book Now
            </button>
          </Link>
        </div>
      </div>

      <ServicesComp />
      <TopDoctors />
      <AboutScroll />
      
    </>
  );
}

export default Home;
