import React,{createContext,useEffect,useState} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currentSymbol = "$";
    const backEndUrl = import.meta.env.VITE_BACKENDURL;


    const [doctors, setDoctors] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token"):"");


    const getDoctorData = async () => {
        try {
            const {data} = await axios.get(backEndUrl + "/doctor", {
                 withCredentials: true ,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(data.success){
                setDoctors(data.data)
            }else{
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error("error.message") 
        }
    }

    const value = {
        backEndUrl,
        currentSymbol,
        doctors,
        getDoctorData,
        token,
        setToken
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider