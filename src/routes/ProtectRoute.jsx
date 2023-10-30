
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;

  return isLogin ? (
    isLogin?.accessToken ? (
      <Outlet to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    )
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectRoute;
