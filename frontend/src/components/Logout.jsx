import { Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { SetIsLoggedInContext } from '../App';
import LogoutIcon from '@mui/icons-material/ExitToApp';

const Logout = () => {
    const setIsLoggedIn = useContext(SetIsLoggedInContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:3001/logout", null, { withCredentials: true });
            if (response.status === 200) {
                setIsLoggedIn(false);
                navigate("/login");
            }
        } catch (error) {
            console.log("Error logging out", error);
        }
    };

    const buttonStyle = {
        marginRight: '20px', 
        fontSize: '1rem', 
        fontWeight: '700', 
        padding: '0.3rem 1.4rem'
    };

    // Check if the user is on the admin page
    const isAdminPage = location.pathname === "/adminhome";

    return isAdminPage ? (
        <ListItem 
            button 
            onClick={handleLogout} 
            sx={{ 
                color: '#7b8b57', 
                '&:hover': {
                    backgroundColor: '#7b8b57',
                    cursor: 'pointer'
                }
            }}
        >
            <ListItemIcon sx={{ color: '#EAEAEA' }}>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#EAEAEA' }} />
        </ListItem>
    ) : (
        <Button style={buttonStyle} color="error" variant="contained" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;
