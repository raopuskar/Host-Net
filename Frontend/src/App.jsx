import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyAppointment from './pages/MyAppointment';
import MyProfile from './pages/MyProfile';
import Services from './pages/Services';
import About from './pages/About';
import Footer from './components/Footer';



function App() {
  const location = useLocation();

  // Hide Navbar on the login page
  const hideNavbar = location.pathname === '/login' || location.pathname === '/admin';
  const hideFooter = location.pathname === '/login' || location.pathname === '/admin';
  

  return (
    <div>
      {!hideNavbar && <Navbar />} {/* Conditionally render Navbar */}
      

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/:docId' element={<Services />} />
      </Routes>

        <ToastContainer />

      


      {!hideFooter && <Footer />} 

    </div>
  );
}

export default App;
