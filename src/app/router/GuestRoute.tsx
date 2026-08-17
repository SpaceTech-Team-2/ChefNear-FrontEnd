import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const token = localStorage.getItem("token");

  // لو التوكين موجود، يوجّه المستخدم فوراً للصفحة الرئيسية (أو الـ /chef)
  if (token) {
    return <Navigate to="/" replace />;
  }

  // لو مش مسجّل، يفتح صفحات اللوجن والـ Register عادي
  return <Outlet />;
};
