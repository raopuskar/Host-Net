import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();  

export const AppContextProvider = (props) => {

    const currentSymbol = "$";
    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [doctor, setDoctor] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
    const [userData, setUserData] = useState(false);
    const [allDoctors, setAllDoctors] = useState([]);
    const [rating, setRating] = useState(null);
    const [specializations,setSpecializations] = useState([])


    const getDoctorData = async (docId) => {
        try {
            //console.log("App context: ",docId)
            const { data } = await axios.get(`${backEndUrl}/doctor/get-profile/${docId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            
            if (data) {
                setDoctor(data.data);
                //console.log("Doctor Data:", data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctor data:", error);
            toast.error(error.response?.data?.message || "Error fetching doctor data");
        }
    };


    const getDoctorReview = async (docId) => {
        try {
            //console.log("id",docId)
            const { data } = await axios.get(`${backEndUrl}/doctor/get-rating/${docId}`);

            //console.log("Context",data)

            if (data) {
                setRating((prevRatings) => ({
                    ...prevRatings,
                    [docId]: {
                        rating: data.averageRating || 0,
                        reviews: data.totalReviews || 0,
                    },
                }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching raiting",error);
            toast.error(error.response?.data?.message || "Error fetching doctor data");
        }

    }
    

    const allDoctorsList = async () => {
        try {
            const { data } = await axios.get(backEndUrl + "/doctor/all", {
                //withCredentials: true,
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
            });

            //console.log(data)

            if (data) {
                setAllDoctors(data);
                //console.log("Doctors data:",data); 
            } else {
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message) // Removed quotes to show actual error message
        }
    }   

    useEffect(() => {
    const data = allDoctors.map((doc) => {
        // Check if specialty is an array and not empty
        return doc.specialty;
    });
    setSpecializations(data);
}, [backEndUrl, allDoctors]);

    //console.log("spec",specializations)

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backEndUrl}/patient/my-profile`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (data.user) {
                setUserData(data.user);
            } else {
                console.error("API Error:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching user data:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Error fetching user data");
        }
    };
    
    const value = {
        currentSymbol,
        backEndUrl,
        doctor,
        getDoctorData,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        allDoctorsList,
        allDoctors,
        setAllDoctors,
        getDoctorReview,
        rating,
        setRating,
        specializations
    }
    
    
    // useEffect(() => {
    //     if (backEndUrl && token) {
    //         getDoctorData();
    //     }
    // }, [backEndUrl, token]);
    
    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);
    
    useEffect(() => {
        if (backEndUrl) {  // Remove token beacuse we have to show also when it is not loggedIn
            allDoctorsList();
        }
    }, [backEndUrl]); 

    // useEffect(() => {
    //     console.log("Current allDoctors:", allDoctors);
    // }, [allDoctors]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}