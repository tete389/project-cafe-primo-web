// import React from 'react'
// import { useNavigate, Navigate, Outlet} from 'react-router-dom';

// const isAuthenticated = () => {
//   return localStorage.getItem("loggedIn")
// };

// // eslint-disable-next-line react/prop-types
// export default function CheckingLoggedin() {
  
//   const navigate = useNavigate();
//   const isAuth = isAuthenticated();
  
//   if (!isAuth) {
//     {console.log(isAuth);}
//     navigate('/login');
//     return null;
    
//   }
  
//   return (
//     <>
//       <Outlet />
//     </>
//   )
// }



// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
// import { appAction } from "../store/app-slice";
// import jwt_decode from "jwt-decode";
// import moment from "moment";
// import axios from "axios";
// import { useState } from "react";

// const RefreshToken = async (apiUrl, refresh_token) => {
//   localStorage.removeItem("accessToken");
//   return await axios({
//     method: "POST",
//     url: `${apiUrl}/api/admin/getToken`,
//     headers: { "Content-Type": "application/json" },
//     data: { token: refresh_token }
//   }).then(
//     (res) => {
//       return res.data.token;
//     },
//     (error) => {
//       return false;
//     }
//   );
// };

// const ProtectRoute = () => {
//   const dispatch = useDispatch();
//   const apiUrl = useSelector((state) => state.app.apiPath);
//   const isLogin = useSelector((state) => state.app.isLogin);
//   const access_token = useSelector((state) => state.app.access_token);
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     if (access_token && isLogin) {
//       if (!isFetching) {
//         const checkAccess = setInterval(async () => {
//           const refresh_token = localStorage.getItem("refreshToken");
//           const accessToken = localStorage.getItem("accessToken");
//           if (accessToken && refresh_token) {
//             const acc = jwt_decode(accessToken);
//             const expiredTime = acc.exp - moment(Math.floor(Date.now() / 1000));
//             if (expiredTime < 1790 && !isFetching) {
//               clearInterval(checkAccess);
//               await RefreshToken(apiUrl, refresh_token).then((token) => {
//                 if (token) {
//                   setIsFetching(true);
//                   dispatch(appAction.checkToken(token));
//                 } else {
//                   dispatch(appAction.logout());
//                 }
//               });
//             } else {
//               dispatch(appAction.checkToken(accessToken));
//             }
//           } else {
//             dispatch(appAction.logout());
//           }
//         }, 10000);
//       }
//       if (isFetching) {
//         setIsFetching(false);
//       }
//     } else {
//       dispatch(appAction.logout());
//     }
//   }, [isFetching, isLogin]);

//   return isLogin ? <Outlet to="/" /> : <Navigate to="/login" />;
// };

// export default ProtectRoute;
