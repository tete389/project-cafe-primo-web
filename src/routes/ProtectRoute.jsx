import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
    const isLogin = localStorage.getItem("loggedIn") || false

    return isLogin!=="true" ? <Outlet to="/dashboard" /> : <Navigate to="/login" />;
}
export default ProtectRoute

