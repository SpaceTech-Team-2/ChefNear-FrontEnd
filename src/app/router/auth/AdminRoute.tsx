import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../../services/api";

export const  AdminRoute  =  () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getMyProfile();
      console.log("test ", response?.data?.role);
      setProfile(response);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
// Admin; 
  if (profile?.data?.role == "Chef") {
    return <Outlet />;
  }
    
  return <Navigate to="/" replace />;
};
