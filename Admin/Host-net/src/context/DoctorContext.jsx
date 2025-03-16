// context/DoctorContext.js
import React, { createContext, useState, useEffect } from 'react';

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const [dToken, setDToken] = useState(localStorage.getItem('dToken'));
  
  useEffect(() => {
    if (dToken) {
      localStorage.setItem('dToken', dToken);
    } else {
      localStorage.removeItem('dToken');
    }
  }, [dToken]);

  return (
    <DoctorContext.Provider value={{ 
      dToken, 
      setDToken,
      // Add other doctor-specific state/functions here
    }}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
