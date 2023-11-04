import React, { useState } from 'react'
import { Route, Routes, Navigate, NavLink } from "react-router-dom";
// Pages
import Home from "../pages/Home";
import Order from "../pages/Order";
import Error from "../pages/Error";
import CustomerLayout from "../pages/customer/CustomerLayout";
import EmployeeRoute from "./EmployeeRoute";
import EmpLogin from "../pages/employee/EmpLogin";

// css
// import "../component/testCss.css";
// import "../component/testCss2.css";


function PageRoute() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin() {
    setLoggedIn(true)
  }

  function handleLogout() {
    setLoggedIn(false)
  }

  return (
    <>
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<EmpLogin login={handleLogin}/>} />
        <Route path="/employee/*" element={<EmployeeRoute loggedIn={loggedIn} logout={handleLogout}/>} />
        <Route path="/customer/*" element={<CustomerLayout />} />
        <Route path="*" element={<Error />} />
        
      </Routes>
    </>
  );
}

export default PageRoute