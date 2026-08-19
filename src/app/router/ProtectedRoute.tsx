import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {


  const token = localStorage.getItem("token");

  // لو التوكين مش موجود، يوجّه المستخدم فوراً لصفحة الـ Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // لو التوكين موجود، يفتح الصفحات المحمية بشكل طبيعي
  return <Outlet />;
};
