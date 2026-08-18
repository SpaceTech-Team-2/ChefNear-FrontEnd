import { Navigate, Outlet } from "react-router-dom";


export const AdminRoute = () => {
  const token = localStorage.getItem("admin");

  if (token) {
      return <Outlet />;
    }
    
    return <Navigate to="/" replace />;
};
