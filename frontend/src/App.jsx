import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Feedback from './components/Feedback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AdminHome from './components/admin/AdminHome';
import LandingPage from './components/LandingPage';

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();
export const UserRoleContext = createContext();
export const SetUserRoleContext = createContext();
export const UserNameContext = createContext(); // ✅ Store User Name
export const SetUserNameContext = createContext(); // ✅ Allow Updates to Name

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(""); // ✅ Store User's Name

    useEffect(() => {
        axios.get('http://localhost:3001/user', { withCredentials: true })
            .then(response => {
                if (response.data.user) {
                    setIsLoggedIn(true);
                    setUserRole(response.data.user.role);
                    setUserName(response.data.user.name); // ✅ Store the Name
                } else {
                    setIsLoggedIn(false);
                    setUserRole(null);
                    setUserName("");
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUserRole(null);
                setUserName("");
            });
    }, [isLoggedIn]); // ✅ Re-run when `isLoggedIn` changes

    return (
        <IsLoggedInContext.Provider value={isLoggedIn}>
            <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
                <UserRoleContext.Provider value={userRole}>
                    <SetUserRoleContext.Provider value={setUserRole}>
                        <UserNameContext.Provider value={userName}>
                            <SetUserNameContext.Provider value={setUserName}>
                                <BrowserRouter>
                                    <Navbar />
                                    <Routes>
                                        <Route path="/" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? "/adminhome" : "/home"} /> : <LandingPage />} />
                                        <Route path="/signup" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? "/adminhome" : "/home"} /> : <Signup />} />
                                        <Route path="/login" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? "/adminhome" : "/home"} /> : <Login />} />
                                        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                                        <Route path="/feedback" element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />} />
                                        <Route path="/adminhome" element={isLoggedIn && userRole === "admin" ? <AdminHome /> : <Navigate to="/home" />} />
                                    </Routes>
                                </BrowserRouter>
                                <ToastContainer position="top-right" autoClose={3000} />
                            </SetUserNameContext.Provider>
                        </UserNameContext.Provider>
                    </SetUserRoleContext.Provider>
                </UserRoleContext.Provider>
            </SetIsLoggedInContext.Provider>
        </IsLoggedInContext.Provider>
    );
}

export default App;
