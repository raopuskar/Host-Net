import React,{createContext,useEffect,useState} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currentSymbol = "$";
    const backEndUrl = import.meta.env.VITE_BACKENDURL;


    const [doctors, setDoctors] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token"):"");
    const [allDoctors, setAllDoctors] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [allAppointments,setAllAppointments] = useState([]);
    const [allReviews,setAllReviews] = useState([])


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
                setDoctors(data.data);
                //console.log("Doctor Data:", data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctor data:", error);
            toast.error(error.response?.data?.message || "Error fetching doctor data");
        }
    };


    const allDoctorsList = async () => {
        try {
            const { data } = await axios.get(backEndUrl + "/doctor/all", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            //console.log("Data",data)

            if (data) {
                setAllDoctors(data)
            } else {
                toast.error(data.message);
                return "Unknown";  // Return a default value if doctor data is not available
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message) // Removed quotes to show actual error message
        }
    }
    
    const allPatientsList = async () => {
        try {
            const { data } = await axios.get(backEndUrl + "/patient/all", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            //console.log("Patient Data",data)

            if (data) {
                setAllPatients(data)
            } else {
                toast.error(data.message);
                return "Unknown";  // Return a default value if doctor data is not available
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    }
    
    const allAppointmentList = async() => {
        try {
            const {data} = await axios.get(backEndUrl + "/doctor/get-all-appointmnet")

            if(data){
                setAllAppointments(data);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const allReviewss = async function(req,res){
        try {
            const {data} = await axios.get(`${backEndUrl}/doctor/get-all-reviews`)
            //console.log("data",data)
            if(data){
                setAllReviews(data)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        backEndUrl,
        currentSymbol,
        doctors,
        getDoctorData,
        token,
        setToken,
        allDoctors,
        setAllDoctors,
        allDoctorsList,
        allAppointments,
        allPatientsList,
        allPatients,
        allReviews
    }

    useEffect(() => {
        if (backEndUrl) {  
            allDoctorsList();
        }
    }, [backEndUrl]); 

    useEffect(() => {
        if (backEndUrl) { 
            allPatientsList();
        }
    }, [backEndUrl,token]); 

    useEffect(() => {
        allAppointmentList()
    },[backEndUrl,token])

    useEffect(() => {
        allReviewss()
    },[backEndUrl,token])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

    
}

export default AppContextProvider