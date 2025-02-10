import { Button } from '@mui/material'
import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SetIsLoggedInContext } from '../App'

const Logout = () => {
    const setIsLoggedIn = useContext(SetIsLoggedInContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try{
            const response = await axios.post("http://localhost:3001/logout", null, {withCredentials: true}) 
            if(response.status===200){
                setIsLoggedIn(false);
                navigate("/login");
            }
        }catch(error){
            console.log("Error logging out", error);
        }
    }
  const button={marginRight:'20px', fontSize:'1.2rem', fontWeight:'700', padding:'0.3rem 1.4rem'}

  return (
    <Button stylele={button} color="error" variant="contained" onClick={handleLogout}>Logout</Button>
  )
}

export default Logout
