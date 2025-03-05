import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhone } from "react-icons/fa";
import logo from '../assets/Logo/logo1.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <img src={logo} alt="HostNet" className="w-24" />
          <h2 className="text-2xl font-bold mb-3">HostNet</h2>
          <p className="text-gray-400">
            Your trusted partner in online doctor appointment booking. Get expert
            healthcare at your fingertips.
          </p>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
            <li><a href="/services" className="text-gray-400 hover:text-white">Services</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            <li><a href="/login" className="text-gray-400 hover:text-white">Login</a></li>
          </ul>
        </div>

        {/* Specialties */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Popular Specialties</h3>
          <ul className="space-y-2">
            <li><a href="/doctors/Cardiology" className="text-gray-400 hover:text-white">Cardiology</a></li>
            <li><a href="/doctors/Dermatologist" className="text-gray-400 hover:text-white">Dermatology</a></li>
            <li><a href="/doctors/Neurologist" className="text-gray-400 hover:text-white">Neurology</a></li>
            <li><a href="/doctors/Orthopedist" className="text-gray-400 hover:text-white">Orthopedics</a></li>
            <li><a href="/doctors/Pediatrician" className="text-gray-400 hover:text-white">Pediatrics</a></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="flex items-center gap-2 text-gray-400">
            <FaPhone /> +91 98765 43210
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <FaEnvelope /> support@medicare.com
          </p>

          {/* Social Media */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-white text-xl"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-white text-xl"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center">
        <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
        <p className="text-gray-400 mb-3">Stay updated with the latest healthcare insights.</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-lg focus:outline-none text-black"
          />
          <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
            Subscribe
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} MediCare. All Rights Reserved. | 
        <a href="#" className="hover:text-white ml-2">Terms & Conditions</a> | 
        <a href="#" className="hover:text-white ml-2">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
