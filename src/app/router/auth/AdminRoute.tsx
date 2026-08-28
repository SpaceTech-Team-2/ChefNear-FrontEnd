import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../../services/api";

export const AdminRoute = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response);
      } catch {
        // مش مسجل دخول أو التوكين مش صالح — هيتحول لـ "/" تحت زي أي دور تاني
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (profile?.data?.role === "Admin") {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
