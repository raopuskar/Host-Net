import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const [aToken, setAToken] = useState(null); //  Initial null (not empty string)
    const [loading, setLoading] = useState(true); // Track loading state

    // Initialize token from localStorage
    // const [aToken, setAToken] = useState(() => {
    //     return localStorage.getItem('aToken') || '';
    // });

    // Get backend URL from environment variables
    const backendUrl = import.meta.env.VITE_BACKENDURL;

    // Persist token to localStorage whenever it changes
    useEffect(() => {
        //console.log("Admin Token Updated:", aToken);
        if (aToken) {
            localStorage.setItem('aToken', aToken);
        } else {
            localStorage.removeItem('aToken');
        }
    }, [aToken]);

    // Validate backend URL
    if (!backendUrl) {
        console.error('Backend URL not configured! Please check your .env file.');
    }

    const value = {
        aToken,
        setAToken,
        backendUrl,
        // Add a logout function
        logout: () => {
            setAToken('');
            localStorage.removeItem('aToken');
        },
        
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
