import React,{createContext,useEffect,useState} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();  

export const AppContextProvider = (props) => {

    const currentSymbol = "$";
    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    

    const [doctor, setDoctor] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token"):"");
    const [userData,setUserData] = useState(false);


    const getDoctorData = async () => {
        try {
            const {data} = await axios.get(backEndUrl + "/doctor", {
                 withCredentials: true ,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(data.success){
                setDoctor(data.data)
            }else{
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error("error.message") 
        }
    }

    const loadUserProfileData = async () => {
        //console.log("Fetching user profile...");
    
        try {
            const { data } = await axios.get(`${backEndUrl}/patient/my-profile`, {
                withCredentials: true ,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            //console.log("User API Response:", data);
    
            if (data.user) {
                setUserData(data.user);
                //console.log("Updated User Data:", data.user);
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
        userData,setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        if (backEndUrl) {
            getDoctorData();
        }
    }, [backEndUrl]);

    useEffect(() => {
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    }, [token]);
    


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

