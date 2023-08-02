import React, { useState } from 'react'
import { Route, Routes, Navigate, NavLink } from 'react-router-dom'
import Product from '../pages/Product'
import Order from '../pages/Order'
// import EmpLogin from '../pages/employee/EmpLogin'
import Dashboard from '../pages/employee/Dashboard'
import EmployeeLayout from '../pages/employee/EmployeeLayout'

function EmployeeRoute( props ) {
  const { loggedIn, logout } = props;

  return (
    <>
     
    <Routes>
        <Route element={<EmployeeLayout logout={logout}/>}>
            <Route index element={ loggedIn ? <Navigate to={"/employee/dashboard"}/> : <Navigate to={"/login"}/>} />
            {/* <Route path="emplogin" element={ loggedIn ? <Navigate to={"/employee/dashboard"} /> : <EmpLogin login={handleLogin}/>} /> */}
            <Route path="dashboard" element={ !loggedIn ? <Navigate to={"/login"} /> : <Dashboard />} />
            <Route path="product" element={ !loggedIn ? <Navigate to={"/login"} /> : <Product />} />
            <Route path="order" element={ !loggedIn ? <Navigate to={"/login"} /> : <Order />} />
        </Route>
   
    </Routes>

    </>
  )
}

export default EmployeeRoute